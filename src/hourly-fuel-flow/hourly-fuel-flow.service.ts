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
      return null;
    }

    const hourlyFuelFlow = await this.repository.export(hourlyOperatingIds);
    const mapped = await this.map.many(hourlyFuelFlow);

    for (const fuelFlow of mapped) {
      fuelFlow.hourlyParameterFuelFlowData = await this.hourlyParameterFuelFlow.export(
        fuelFlow.id,
      );
    }

    return mapped;
  }
}
