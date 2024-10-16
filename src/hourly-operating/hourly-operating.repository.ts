import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { HrlyOpData } from '../entities/hrly-op-data.entity';

@Injectable()
export class HourlyOperatingRepository extends Repository<HrlyOpData> {
  constructor(entityManager: EntityManager) {
    super(HrlyOpData, entityManager);
  }

  async export(monitoringLocationIds: string[], year: number, quarter: number) {
    const query = this.createQueryBuilder('hod')
      .innerJoinAndSelect('hod.monitorLocation', 'l')
      .innerJoinAndSelect('hod.reportingPeriod', 'r')
      .leftJoinAndSelect('l.unit', 'u')
      .leftJoinAndSelect('l.stackPipe', 'sp')
      .where(`hod.monitoringLocationId IN (:...monitoringLocationIds)`, {
        monitoringLocationIds: monitoringLocationIds,
      })
      .andWhere('r.year = :year ', { year })
      .andWhere('r.quarter = :quarter ', { quarter })
      .orderBy({
        'hod.date': 'ASC',
        'hod.hour': 'ASC'
      });

    return query.getMany();
  }
}
