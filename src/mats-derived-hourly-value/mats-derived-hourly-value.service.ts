import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { MatsDerivedHourlyValueDTO } from '../dto/mats-derived-hourly-value.dto';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueRepository } from './mats-derived-hourly-value.repository';

@Injectable()
export class MatsDerivedHourlyValueService {

  constructor(
    private readonly dataSource: DataSource,
    private readonly map: MatsDerivedHourlyValueMap,
  ) {}

  async export(rptPeriodId: number, monLocIds: string[]): Promise<MatsDerivedHourlyValueDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      const matsDerivedHourlyValueRepository = new MatsDerivedHourlyValueRepository(replicaManager);
      const matsDerivedHourlyValueData = await matsDerivedHourlyValueRepository.export(rptPeriodId, monLocIds);
      return this.map.many(matsDerivedHourlyValueData);
    });
  }
}
