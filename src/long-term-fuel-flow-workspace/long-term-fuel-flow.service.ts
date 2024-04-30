import { Injectable } from '@nestjs/common';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { randomUUID } from 'crypto';
import { DeleteResult, FindConditions } from 'typeorm';

import { LongTermFuelFlowDTO } from '../dto/long-term-fuel-flow.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { LongTermFuelFlow } from '../entities/workspace/long-term-fuel-flow.entity';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { LongTermFuelFlowWorkspaceRepository } from './long-term-fuel-flow.repository';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';
import { EmissionsImportDTO } from '../dto/emissions.dto';

@Injectable()
export class LongTermFuelFlowWorkspaceService {
  constructor(
    private readonly repository: LongTermFuelFlowWorkspaceRepository,
    private readonly map: LongTermFuelFlowMap,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async delete(
    criteria: FindConditions<LongTermFuelFlow>,
  ): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  async export(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<LongTermFuelFlowDTO[]> {
    const result = await this.repository.export(
      monitoringLocationIds,
      params.year,
      params.quarter,
    );
    return this.map.many(result);
  }

  async import(
    emissionsImport: EmissionsImportDTO,
    monitoringLocations,
    reportingPeriodId,
    identifiers: ImportIdentifiers,
    currentTime: string,
  ): Promise<void> {
    if (
      !Array.isArray(emissionsImport?.longTermFuelFlowData) ||
      emissionsImport?.longTermFuelFlowData.length === 0
    ) {
      return;
    }

    const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
      'camdecmpswks.long_term_fuel_flow',
      [
        'ltff_id',
        'rpt_period_id',
        'mon_loc_id',
        'mon_sys_id',
        'fuel_flow_period_cd',
        'long_term_fuel_flow_value',
        'ltff_uom_cd',
        'gross_calorific_value',
        'gcv_uom_cd',
        'total_heat_input',
        'userid',
        'add_date',
        'update_date',
      ],
    );

    for (const longTermFuelFlowDatum of emissionsImport.longTermFuelFlowData) {
      const monitoringLocationId = monitoringLocations.filter(location => {
        return (
          location.unit?.name === longTermFuelFlowDatum.unitId ||
          location.stackPipe?.name === longTermFuelFlowDatum.stackPipeId
        );
      })[0].id;

      const uid = randomUUID();
      longTermFuelFlowDatum['id'] = uid;

      bulkLoadStream.writeObject({
        id: uid,
        reportingPeriodId: reportingPeriodId,
        monLocId: monitoringLocationId,
        monSysId:
          identifiers?.locations[monitoringLocationId]?.monitoringSystems?.[
            longTermFuelFlowDatum.monitoringSystemId
          ] || null,
        fuelFlowPeriodCd: longTermFuelFlowDatum.fuelFlowPeriodCode,
        longTermFuelFlowValue: longTermFuelFlowDatum.longTermFuelFlowValue,
        ltffUomCd: longTermFuelFlowDatum.longTermFuelFlowUnitsOfMeasureCode,
        grossCalorificValue: longTermFuelFlowDatum.grossCalorificValue,
        gcvUomCd: longTermFuelFlowDatum.gcvUnitsOfMeasureCode,
        totalHeatInput: longTermFuelFlowDatum.totalHeatInput,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
      });
    }

    bulkLoadStream.complete();
    await bulkLoadStream.finished;
  }
}
