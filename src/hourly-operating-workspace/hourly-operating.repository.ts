import { HrlyOpData } from 'src/entities/hrly-op-data.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(HrlyOpData)
export class HourlyOperatingWorkspaceRepository extends Repository<HrlyOpData> {
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
      .andWhere('r.quarter = :quarter ', { quarter });

    return query.getMany();
  }
}
