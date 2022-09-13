import { getManager } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { EmissionsViewDTO } from '../dto/emissions-view.dto';
import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsDTO, EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsMap } from '../maps/emissions.map';
import { EmissionsWorkspaceRepository } from './emissions.repository';
import { DailyTestSummaryWorkspaceService } from '../daily-test-summary-workspace/daily-test-summary.service';
import { PlantRepository } from '../plant/plant.repository';
import { DeleteResult, FindConditions } from 'typeorm';
import { EmissionEvaluation } from '../entities/emission-evaluation.entity';
import { DailyTestSummaryDTO } from '../dto/daily-test-summary.dto';
import { HourlyOperatingWorkspaceService } from '../hourly-operating-workspace/hourly-operating.service';
import { isUndefinedOrNull } from '../utils/utils';

@Injectable()
export class EmissionsWorkspaceService {
  constructor(
    private readonly map: EmissionsMap,
    private readonly repository: EmissionsWorkspaceRepository,
    private readonly dailyTestSummaryService: DailyTestSummaryWorkspaceService,
    private readonly plantRepository: PlantRepository,
    private readonly hourlyOperatingService: HourlyOperatingWorkspaceService,
  ) {}

  async delete(
    criteria: FindConditions<EmissionEvaluation>,
  ): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  async getView(params: EmissionsViewParamsDTO): Promise<EmissionsViewDTO> {
    const mgr = getManager();
    const schema = 'camdecmpswks';

    const rptPeriod = await mgr.query(`
      SELECT rpt_period_id AS "id"
      FROM camdecmpsmd.reporting_period
      WHERE calendar_year = $1 AND quarter = $2;`,
      [params.year, params.quarter]
    );

    const monLocs = await mgr.query(`
      SELECT ml.mon_loc_id AS "id"
      FROM ${schema}.monitor_location ml
      JOIN ${schema}.monitor_plan_location mpl USING(mon_loc_id)
      LEFT JOIN camd.unit u USING(unit_id)
      LEFT JOIN ${schema}.stack_pipe sp USING(stack_pipe_id)
      WHERE mpl.mon_plan_id = $1 AND (u.unitid = ANY($2) OR sp.stack_name = ANY($3));`,
      [params.monitorPlanId, params.unitIds, params.stackPipeIds]
    );

    const columns = await mgr.query(`
      SELECT
        ds.display_name AS "viewName",
        ds.no_results_msg AS "noResultsMsg",
        col.name AS "columnName",
        col.alias AS "columnAlias",
        col.display_name AS "columnLabel"
      FROM camdecmpsaux.datacolumn col
      JOIN camdecmpsaux.datatable dt USING(datatable_id)
      JOIN camdecmpsaux.dataset ds USING(dataset_cd)
      WHERE ds.dataset_cd = $1
      ORDER BY col.column_order`,
      [params.viewCode]
    );

    let columnList = columns.map(i => `${i.columnName} AS "${i.columnAlias}"`);

    const viewData = await mgr.query(`
      SELECT ${columnList.join(',')}
      FROM ${schema}.emission_view_${params.viewCode.toLowerCase()}
      WHERE rpt_period_id = $1 AND mon_loc_id = ANY($2)
      LIMIT 2;`,
      [rptPeriod[0].id, monLocs.map(i => i.id)]
    );

    columnList = columns.map(i =>
      JSON.parse(`{ "name": "${i.columnAlias}", "displayName": "${i.columnLabel}" }`)
    );

    console.log(viewData);

    return {
      name: columns[0].viewName,
      noResultsMessage: columns[0].noResultsMsg,
      columns: columnList,
      results: viewData,
    }
  }

  async export(params: EmissionsParamsDTO): Promise<EmissionsDTO> {
    const promises = [];
    const DAILY_TEST_SUMMARIES = 0;
    const HOURLY_OPERATING = 1;

    const emissions = await this.repository.export(
      params.monitorPlanId,
      params.year,
      params.quarter,
    );

    if (emissions) {
      const locationIds = emissions.monitorPlan?.locations?.map(s => s.id);

      promises.push(this.dailyTestSummaryService.export(locationIds, params));
      promises.push(this.hourlyOperatingService.export(locationIds, params));

      const promiseResult = await Promise.all(promises);
      const results = await this.map.one(emissions);
      results.dailyTestSummaryData = promiseResult[DAILY_TEST_SUMMARIES];
      results.hourlyOperatingData = promiseResult[HOURLY_OPERATING];

      return results;
    }
    return new EmissionsDTO();
  }

  async findOne() {
    return this.repository.findOne();
  }

  async import(params: EmissionsImportDTO): Promise<{ message: string }> {
    const plantLocation = await this.plantRepository.getImportLocations({
      orisCode: params.orisCode,
      stackIds: params.dailyTestSummaryData?.map(data => data.stackPipeId),
      unitIds: params.dailyTestSummaryData?.map(data => data.unitId),
    });

    if (isUndefinedOrNull(plantLocation)) {
      throw new NotFoundException('Plant not found.');
    }

    const filteredMonitorPlans = plantLocation.monitorPlans?.filter(plan => {
      return (
        plan.beginRptPeriod.year === params.year &&
        plan.beginRptPeriod.quarter === params.quarter
      );
    });

    const monitorPlanId = filteredMonitorPlans[0].id;
    const monitoringLocationId = filteredMonitorPlans[0].locations?.[0].id;
    const reportingPeriodId = filteredMonitorPlans[0].beginRptPeriod.id;

    const evaluationDeletes: Array<Promise<DeleteResult>> = [];
    for (const monitorPlan of filteredMonitorPlans) {
      evaluationDeletes.push(
        this.delete({
          monitorPlanId: monitorPlan.id,
          reportingPeriodId: monitorPlan.beginRptPeriod.id,
        }),
      );
    }
    await Promise.all(evaluationDeletes);

    await this.importDailyTestSummaries(
      params,
      reportingPeriodId,
      monitoringLocationId,
    );

    await this.repository.save(
      this.repository.create({
        monitorPlanId,
        reportingPeriodId,
      }),
    );

    return {
      message: `Successfully Imported Emissions Data for Facility Id/Oris Code [${params.orisCode}]`,
    };
  }

  async importDailyTestSummaries(
    emissionsImport: EmissionsImportDTO,
    reportingPeriodId: number,
    monitoringLocationId: string,
  ) {
    const dailyTestSummaryImports: Array<Promise<DailyTestSummaryDTO>> = [];

    if (Array.isArray(emissionsImport.dailyTestSummaryData)) {
      for (const dailyTestSummaryDatum of emissionsImport.dailyTestSummaryData) {
        dailyTestSummaryImports.push(
          this.dailyTestSummaryService.import({
            ...dailyTestSummaryDatum,
            reportingPeriodId,
            monitoringLocationId,
          }),
        );
      }
      await Promise.all(dailyTestSummaryImports);
    }
  }
}
