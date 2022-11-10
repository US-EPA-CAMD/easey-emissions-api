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
    private readonly hourlyParameterFuelFlow: HourlyParameterFuelFlowService,
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
}
