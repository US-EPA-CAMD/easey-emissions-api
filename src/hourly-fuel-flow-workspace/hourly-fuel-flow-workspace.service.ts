import { Injectable } from '@nestjs/common';
import { HourlyFuelFlowWorkspaceRepository } from './hourly-fuel-flow-workspace.repository';
import {
  HourlyFuelFlowDTO,
  HourlyFuelFlowImportDTO,
} from '../dto/hourly-fuel-flow.dto';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowWorkspaceService } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.service';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { randomUUID } from 'crypto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { HourlyParamFuelFlowDTO } from 'src/dto/hourly-param-fuel-flow.dto';

@Injectable()
export class HourlyFuelFlowWorkspaceService {
  constructor(
    private readonly repository: HourlyFuelFlowWorkspaceRepository,
    private readonly map: HourlyFuelFlowMap,
    private readonly hourlyParameterFuelFlow: HourlyParameterFuelFlowWorkspaceService,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async export(hourlyOperatingIds: string[]): Promise<HourlyFuelFlowDTO[]> {
    if (!Array.isArray(hourlyOperatingIds) || hourlyOperatingIds.length < 1) {
      return [];
    }

    const hourlyFuelFlow = await this.repository.export(hourlyOperatingIds);

    if (!Array.isArray(hourlyFuelFlow) || hourlyFuelFlow.length < 1) {
      return [];
    }

    const mapped = await this.map.many(hourlyFuelFlow);

    const mappedIds = mapped.map(el => el.id);

    if (mappedIds.length > 0) {
      const hourlyParamFuelFlowData = await this.hourlyParameterFuelFlow.export(
        mappedIds,
      );

      this.organizeData(mapped, hourlyParamFuelFlowData); 
    }
    return mapped;
  }

  private organizeData(
    parentArray: HourlyFuelFlowDTO[],
    childArray: HourlyParamFuelFlowDTO[],
  ) {
    const parentMap = new Map();

    parentArray.forEach(parentObj => {
      parentMap.set(parentObj.id, parentObj);
      parentObj.hourlyParameterFuelFlowData = [];
    });

    childArray.forEach(childObj => {
      const parentId = childObj.hourlyFuelFlowId;
      if (parentMap.has(parentId)) {
        const parentObj = parentMap.get(parentId);
        parentObj.hourlyParameterFuelFlowData.push(childObj);
      }
    });
  }

  async buildObjectList(
    data: HourlyFuelFlowImportDTO[],
    hourId: string,
    monitorLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
    parentObjectList: Array<object>,
    childObjectList: Array<object>,
    currentTime: string,
  ): Promise<void> {
    if (!data) {
      return;
    }
    for (const dataChunk of data) {
      const uid = randomUUID();
      dataChunk['id'] = uid;

      parentObjectList.push({
        id: uid,
        hourId,
        monitoringSystemId:
          identifiers?.locations[monitorLocationId]?.monitoringSystems?.[dataChunk.monitoringSystemId] || null,
        fuelCode: dataChunk.fuelCode,
        fuelUsageTime: dataChunk.fuelUsageTime,
        volumetricFlowRate: dataChunk.volumetricFlowRate,
        sourceOfDataVolumetricCode: dataChunk.sourceOfDataVolumetricCode,
        massFlowRate: dataChunk.massFlowRate,
        sourceOfDataMassCode: dataChunk.sourceOfDataMassCode,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
        volumetricUnitsOfMeasureCode: dataChunk.volumetricUnitsOfMeasureCode,
        reportingPeriodId: reportingPeriodId,
        monitoringLocationId: monitorLocationId,
      });
    }

    let promises = [];
    for (const dataChunk of data) {
      // Load children hourly param fuel flow records
      promises.push(
        this.hourlyParameterFuelFlow.buildObjectList(
          dataChunk.hourlyParameterFuelFlowData,
          dataChunk['id'],
          monitorLocationId,
          reportingPeriodId,
          identifiers,
          childObjectList,
          currentTime,
        ),
      );
    }

    await Promise.all(promises);
  }

  async import(
    objectList: Array<object>,
    childObjectList: Array<object>,
  ): Promise<void> {
    if (objectList && objectList.length > 0) {
      const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
        'camdecmpswks.hrly_fuel_flow',
        [
          'hrly_fuel_flow_id',
          'hour_id',
          'mon_sys_id',
          'fuel_cd',
          'fuel_usage_time',
          'volumetric_flow_rate',
          'sod_volumetric_cd',
          'mass_flow_rate',
          'sod_mass_cd',
          'userid',
          'add_date',
          'update_date',
          'volumetric_uom_cd',
          'rpt_period_id',
          'mon_loc_id',
        ],
      );

      for (const slice of objectList) {
        bulkLoadStream.writeObject(slice);
      }

      bulkLoadStream.complete();
      await bulkLoadStream.finished;

      if (childObjectList && childObjectList.length > 0) {
        await this.hourlyParameterFuelFlow.import(childObjectList); //Load children records after parent records
      }
    }
  }
}
