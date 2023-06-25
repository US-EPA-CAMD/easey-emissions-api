import { Injectable } from '@nestjs/common';
import { HourlyFuelFlowRepository } from './hourly-fuel-flow.repository';
import { HourlyFuelFlowDTO } from '../dto/hourly-fuel-flow.dto';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowService } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.service';

@Injectable()
export class HourlyFuelFlowService {

  constructor(
    private readonly repository: HourlyFuelFlowRepository,
    private readonly map: HourlyFuelFlowMap,
    private readonly hourlyParameterFuelFlowService: HourlyParameterFuelFlowService,
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
        this.hourlyParameterFuelFlowService.export(fuelFlow.id).then(data => {
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

  async removeNonReportedValues(hourlyFuelFlowData: HourlyFuelFlowDTO[]) {
    const promises = [];
    hourlyFuelFlowData.forEach(dto => {
      promises.push(this.hourlyParameterFuelFlowService.removeNonReportedValues(dto.hourlyParameterFuelFlowData));
      delete dto.id;
      delete dto.hourId;
      delete dto.monitoringLocationId;
      delete dto.reportingPeriodId;
      delete dto.monitoringSystemRecordId;
      delete dto.calcMassFlowRate;
      delete dto.calcVolumetricFlowRate;
      delete dto.calcAppdStatus;
      delete dto.userId;
      delete dto.addDate;
      delete dto.updateDate;
    });

    await Promise.all(promises);
  }
}
