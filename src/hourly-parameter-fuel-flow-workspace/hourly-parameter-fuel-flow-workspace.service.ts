import { Injectable } from '@nestjs/common';
import { HourlyParameterFuelFlowWorkspaceRepository } from './hourly-parameter-fuel-flow-workspace.repository';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import {
  HourlyParamFuelFlowDTO,
  HourlyParamFuelFlowImportDTO,
} from '../dto/hourly-param-fuel-flow.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { randomUUID } from 'crypto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

@Injectable()
export class HourlyParameterFuelFlowWorkspaceService {
  constructor(
    private readonly map: HourlyParameterFuelFlowMap,
    private readonly repository: HourlyParameterFuelFlowWorkspaceRepository,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async export(hourlyFuelFlowIds: string[]): Promise<HourlyParamFuelFlowDTO[]> {
    const hrlyParams = await this.repository.export(hourlyFuelFlowIds);

    return this.map.many(hrlyParams);
  }

  async buildObjectList(
    data: HourlyParamFuelFlowImportDTO[],
    parentId: string,
    monitorLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
    objectList: Array<object>,
    currentTime: string,
  ): Promise<void> {
    for (const dataChunk of data) {
      objectList.push({
        id: randomUUID(),
        parentId: parentId,
        monitoringSystemId:
          identifiers.monitoringSystems?.[dataChunk.monitoringSystemId] || null,
        formulaIdentifier:
          identifiers.monitorFormulas?.[dataChunk.formulaId] || null,
        parameterCode: dataChunk.parameterCode,
        parameterValueForFuel: dataChunk.parameterValueForFuel,
        sampleTypeCode: dataChunk.sampleTypeCode,
        operatingConditionCode: dataChunk.operatingConditionCode,
        segmentNumber: dataChunk.segmentNumber,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
        parameterUomCode: dataChunk.parameterUnitsOfMeasureCode,
        reportingPeriodId: reportingPeriodId,
        monitoringLocationId: monitorLocationId,
      });
    }
  }

  async import(objectList: Array<object>): Promise<void> {
    if (objectList && objectList.length > 0) {
      const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
        'camdecmpswks.hrly_param_fuel_flow',
        [
          'hrly_param_ff_id',
          'hrly_fuel_flow_id',
          'mon_sys_id',
          'mon_form_id',
          'parameter_cd',
          'param_val_fuel',
          'sample_type_cd',
          'operating_condition_cd',
          'segment_num',
          'userid',
          'add_date',
          'update_date',
          'parameter_uom_cd',
          'rpt_period_id',
          'mon_loc_id',
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
