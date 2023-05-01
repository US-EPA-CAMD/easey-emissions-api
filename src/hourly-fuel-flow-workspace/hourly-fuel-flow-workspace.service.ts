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

@Injectable()
export class HourlyFuelFlowWorkspaceService {
  private importedData = [];

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

    if (!Array.isArray(hourlyFuelFlow)) {
      return [];
    }

    const mapped = await this.map.many(hourlyFuelFlow);

    const promises = [];
    for (const fuelFlow of mapped) {
      promises.push(
        this.hourlyParameterFuelFlow.export(fuelFlow.id).then(data => {
          if (!Array.isArray(fuelFlow.hourlyParameterFuelFlowData)) {
            fuelFlow.hourlyParameterFuelFlowData = [];
          }
          fuelFlow.hourlyParameterFuelFlowData.push(...data);
        }),
      );
    }

    await Promise.all(promises);
    return mapped;
  }

  async importPrep(
    data: HourlyFuelFlowImportDTO[],
    hourId: string,
    monitorLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ): Promise<void> {
    if (data && data.length > 0) {
      for (const dataChunk of data) {
        const uid = randomUUID();
        dataChunk['id'] = uid;

        this.importedData.push({
          id: uid,
          hourId,
          fuelCode: dataChunk.fuelCode,
          fuelUsageTime: dataChunk.fuelUsageTime,
          volumetricFlowRate: dataChunk.volumetricFlowRate,
          volumetricUnitsOfMeasureCode: dataChunk.volumetricUnitsOfMeasureCode,
          sourceOfDataVolumetricCode: dataChunk.sourceOfDataVolumetricCode,
          massFlowRate: dataChunk.massFlowRate,
          sourceOfDataMassCode: dataChunk.sourceOfDataMassCode,
          monitoringSystemId:
            identifiers.monitoringSystems?.[dataChunk.monitoringSystemId] ||
            null,
          monitoringLocationId: monitorLocationId,
          reportingPeriodId: reportingPeriodId,
          addDate: new Date().toISOString(),
          updateDate: new Date().toISOString(),
          userId: identifiers?.userId,
        });
      }

      const promises = [];

      for (const dataChunk of data) {
        // Load children hourly param fuel flow records
        promises.push(
          this.hourlyParameterFuelFlow.importPrep(
            dataChunk.hourlyParameterFuelFlowData,
            dataChunk['id'],
            monitorLocationId,
            reportingPeriodId,
            identifiers,
          ),
        );
      }

      await Promise.all(promises);
    }
  }

  async import(): Promise<void> {
    if (this.importedData.length > 0) {
      const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
        'camdecmpswks.hrly_fuel_flow',
        [
          'hrly_fuel_flow_id',
          'hour_id',
          'fuel_cd',
          'fuel_usage_time',
          'volumetric_flow_rate',
          'volumetric_uom_cd',
          'sod_volumetric_cd',
          'mass_flow_rate',
          'sod_mass_cd',
          'mon_sys_id',
          'mon_loc_id',
          'rpt_period_id',
          'add_date',
          'update_date',
          'userid',
        ],
      );

      for (const obj of this.importedData) {
        bulkLoadStream.writeObject(obj);
      }

      bulkLoadStream.complete();
      await bulkLoadStream.finished;
      await this.hourlyParameterFuelFlow.import();
    }
  }
}
