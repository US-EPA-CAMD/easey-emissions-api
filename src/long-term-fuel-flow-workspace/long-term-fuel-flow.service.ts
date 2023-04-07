import { Injectable } from '@nestjs/common';
import { LongTermFuelFlowDTO } from '../dto/long-term-fuel-flow.dto';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { LongTermFuelFlowWorkspaceRepository } from './long-term-fuel-flow.repository';

@Injectable()
export class LongTermFuelFlowWorkspaceService {
  constructor(
    private readonly map: LongTermFuelFlowMap,
    private readonly repository: LongTermFuelFlowWorkspaceRepository,
  ) {}
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
  async import() {}
}
