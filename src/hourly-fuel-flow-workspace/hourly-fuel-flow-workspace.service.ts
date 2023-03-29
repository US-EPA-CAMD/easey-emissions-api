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
import { HourlyOperatingImportDTO } from '../dto/hourly-operating.dto';

@Injectable()
export class HourlyFuelFlowWorkspaceService {
  constructor(
    private readonly repository: HourlyFuelFlowWorkspaceRepository,
    private readonly map: HourlyFuelFlowMap,
    private readonly hourlyParameterFuelFlow: HourlyParameterFuelFlowWorkspaceService,
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
            fuelFlow.hourlyParameterFuelFlowData = []
          }
          fuelFlow.hourlyParameterFuelFlowData.push(...data);
        })
      );
    }
   
    await Promise.all(promises);
    return mapped;
  }

  async import(
    data: HourlyFuelFlowImportDTO,
    hourlyOperatingImport: HourlyOperatingImportDTO,
    hourId: string,
    monitoringLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ) {
    const result = await this.repository.save(
      this.repository.create({
        id: randomUUID(),
        hourId,
        fuelCode: data.fuelCode,
        fuelUsageTime: data.fuelUsageTime,
        volumetricFlowRate: data.volumetricFlowRate,
        volumetricUnitsOfMeasureCode: data.volumetricUnitsOfMeasureCode,
        sourceOfDataVolumetricCode: data.sourceOfDataVolumetricCode,
        massFlowRate: data.massFlowRate,
        sourceOfDataMassCode: data.sourceOfDataMassCode,
        monitoringSystemId:
          identifiers.monitoringSystems?.[data.monitoringSystemId],
        monitoringLocationId: monitoringLocationId,
        reportingPeriodId: reportingPeriodId,
        addDate: new Date(),
        updateDate: new Date(),
        userId: identifiers?.userId,
      }),
    );

    if (
      Array.isArray(hourlyOperatingImport.hourlyFuelFlowData) &&
      hourlyOperatingImport.hourlyFuelFlowData.length > 0
    ) {
      for (const fuelFlowDatum of hourlyOperatingImport.hourlyFuelFlowData) {
        for (const paramFuelFlow of fuelFlowDatum.hourlyParameterFuelFlowData) {
          await this.hourlyParameterFuelFlow.import(
            paramFuelFlow,
            result.id,
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
          );
        }
      }
    }
    return this.map.one(result);
  }
}
