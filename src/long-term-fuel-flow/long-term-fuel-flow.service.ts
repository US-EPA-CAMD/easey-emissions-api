import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
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
    private readonly repository: LongTermFuelFlowRepository,
  ) {}

  async export(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<LongTermFuelFlowDTO[]> {
    return withSlaveConnection(this.dataSource, async () => {
      const result = await this.repository.export(
        monitoringLocationIds,
        params.year,
        params.quarter,
      );
      return this.map.many(result);
    });
  }
}
