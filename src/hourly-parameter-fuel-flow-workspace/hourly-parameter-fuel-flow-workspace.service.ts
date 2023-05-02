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

  async export(hourlyFuelFlowId: string): Promise<HourlyParamFuelFlowDTO[]> {
    const hrlyParams = await this.repository.export(hourlyFuelFlowId);

    return this.map.many(hrlyParams);
  }

  async buildObjectList(
    data: HourlyParamFuelFlowImportDTO[],
    parentId: string,
    monitorLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
    objectList: Array<object>,
  ): Promise<void> {
    for (const dataChunk of data) {
      objectList.push({
        id: randomUUID(),
        parentId: parentId,
        parameterCode: dataChunk.parameterCode,
        parameterValueForFuel: dataChunk.parameterValueForFuel,
        formulaIdentifier:
          identifiers.monitorFormulas?.[dataChunk.formulaIdentifier] || null,
        sampleTypeCode: dataChunk.sampleTypeCode,
        monitoringSystemId:
          identifiers.monitoringSystems?.[dataChunk.monitoringSystemId] || null,
        operatingConditionCode: dataChunk.operatingConditionCode,
        segmentNumber: dataChunk.segmentNumber,
        parameterUomCode: dataChunk.parameterUomCode,
        monitoringLocationId: monitorLocationId,
        reportingPeriodId: reportingPeriodId,
        addDate: currentDateTime().toISOString(),
        updateDate: currentDateTime().toISOString(),
        userId: identifiers?.userId,
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
          'parameter_cd',
          'param_val_fuel',
          'mon_form_id',
          'sample_type_cd',
          'mon_sys_id',
          'operating_condition_cd',
          'segment_num',
          'parameter_uom_cd',
          'mon_loc_id',
          'rpt_period_id',
          'add_date',
          'update_date',
          'userid',
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
