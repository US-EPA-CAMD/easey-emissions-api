import { Injectable } from '@nestjs/common';
import { HourlyFuelFlowWorkspaceRepository } from './hourly-fuel-flow-workspace.repository';
import { HourlyFuelFlowDTO } from '../dto/hourly-fuel-flow.dto';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowWorkspaceService } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.service';

@Injectable()
export class HourlyFuelFlowWorkspaceService {
  constructor(
    private readonly repository: HourlyFuelFlowWorkspaceRepository,
    private readonly map: HourlyFuelFlowMap,
    private readonly hourlyParameterFuelFlow: HourlyParameterFuelFlowWorkspaceService,
  ) {}

  async export(monitoringLocationIds: string[]): Promise<HourlyFuelFlowDTO[]> {
    if (
      !Array.isArray(monitoringLocationIds) ||
      monitoringLocationIds.length < 1
    ) {
      return null;
    }

    const hourlyFuelFlow = await this.repository.export(monitoringLocationIds);
    const mapped = await this.map.many(hourlyFuelFlow);

    for (const fuelFlow of mapped) {
      fuelFlow.hourlyParameterFuelFlowData = await this.hourlyParameterFuelFlow.export(
        fuelFlow.id,
      );
    }

    return this.map.many(hourlyFuelFlow);
  }
}
