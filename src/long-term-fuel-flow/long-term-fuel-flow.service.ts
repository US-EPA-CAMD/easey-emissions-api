import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { LongTermFuelFlowDTO } from '../dto/long-term-fuel-flow.dto';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';
import { LongTermFuelFlowRepository } from './long-term-fuel-flow.repository';

@Injectable()
export class LongTermFuelFlowService {

  constructor(
    private readonly dataSource: DataSource,
    private readonly map: LongTermFuelFlowMap,
  ) {}

  async export(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<LongTermFuelFlowDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      const longTermFuelFlowRepository = new LongTermFuelFlowRepository(replicaManager);
      const result = await longTermFuelFlowRepository.export(
        monitoringLocationIds,
        params.year,
        params.quarter,
      );
      return this.map.many(result);
    });
  }
}
