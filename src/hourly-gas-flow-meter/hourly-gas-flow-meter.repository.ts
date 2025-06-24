import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { HrlyGasFlowMeter } from '../entities/hrly-gas-flow-meter.entity';

@Injectable()
export class HourlyGasFlowMeterRepository extends Repository<HrlyGasFlowMeter> {
  constructor(entityManager: EntityManager) {
    super(HrlyGasFlowMeter, entityManager);
  }

  async export(rptPeriodId: number, monLocIds: string[]) {
    const query = this.createQueryBuilder('hgfm')
      .leftJoinAndSelect('hgfm.component', 'c')
      .where('hgfm.reportingPeriodId = :rptPeriodId', { rptPeriodId })
      .andWhere('hgfm.monitoringLocationId IN (:...monLocIds)', { monLocIds })
    return query.getMany();
  }
}
