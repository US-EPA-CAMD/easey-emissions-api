import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { Nsps4tCompliancePeriodWorkspaceRepository } from './nsps4t-compliance-period-workspace.repository';
import {
  Nsps4tCompliancePeriodDTO,
  Nsps4tCompliancePeriodImportDTO,
} from '../dto/nsps4t-compliance-period.dto';
import { exportNps4tCompliancePeriodData } from '../nsps4t-compliance-period-functions/export-nsps4t-compliance-period-data';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

@Injectable()
export class Nsps4tCompliancePeriodWorkspaceService {
  constructor(
    private readonly repository: Nsps4tCompliancePeriodWorkspaceRepository,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async export(
    nsps4tSummaryIds: string[],
  ): Promise<Nsps4tCompliancePeriodDTO[]> {
    return exportNps4tCompliancePeriodData({
      nsps4tSummaryIds,
      repository: this.repository,
    });
  }

  async buildObjectList(
    data: Nsps4tCompliancePeriodImportDTO[],
    nsps4tSumId: string,
    monitoringLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
    objectList: Array<object>,
    currentTime: string,
  ): Promise<void> {
    for (const dataChunk of data) {
      objectList.push({
        nsps4tCmpId: randomUUID(),
        nsps4tSumId: nsps4tSumId,
        beginYear: dataChunk.beginYear,
        beginMonth: dataChunk.beginMonth,
        endYear: dataChunk.endYear,
        endMonth: dataChunk.endMonth,
        avgCo2EmissionRate: dataChunk.averageCO2EmissionRate,
        co2EmissionRateUomCd: dataChunk.co2EmissionRateUomCode,
        pctValidOpHours: dataChunk.percentValidOpHours,
        co2ViolationInd: dataChunk.violationOfCo2StandardIndicator,
        co2ViolationComment: dataChunk.violationOfCo2StandardComment,
        monLocId: monitoringLocationId,
        rptPeriodId: reportingPeriodId,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
      });
    }
  }

  async import(objectList: Array<object>): Promise<void> {
    if (objectList && this.buildObjectList.length > 0) {
      const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
        'camdecmpswks.nsps4t_compliance_period',
        [
          'nsps4t_cmp_id',
          'nsps4t_sum_id',
          'begin_year',
          'begin_month',
          'end_year',
          'end_month',
          'avg_co2_emission_rate',
          'co2_emission_rate_uom_cd',
          'pct_valid_op_hours',
          'co2_violation_ind',
          'co2_violation_comment',
          'mon_loc_id',
          'rpt_period_id',
          'userid',
          'add_date',
          'update_date',
        ],
      );
      for (const slice of objectList) {
        bulkLoadStream.writeObject(slice);
      }

      bulkLoadStream.complete();
      await bulkLoadStream.finished;
    }
  }
}
