import { EntityRepository, Repository } from 'typeorm';
import { LongTermFuelFlow } from '../entities/workspace/long-term-fuel-flow.entity';

@EntityRepository(LongTermFuelFlow)
export class LongTermFuelFlowWorkspaceRepository extends Repository<
  LongTermFuelFlow
> {
  async export(monitoringLocationIds: string[], year: number, quarter: number) {
    const query = this.createQueryBuilder('ltff')
      .innerJoinAndSelect('ltff.monitorLocation', 'ml')
      .innerJoinAndSelect('ltff.reportingPeriod', 'rp')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoinAndSelect('ml.stackPipe', 'sp')
      .leftJoinAndSelect('ltff.monitorSystem', 'ms')
      .where('ltff.monitoringLocationId IN (:...monitoringLocationIds)', {
        monitoringLocationIds: monitoringLocationIds,
      })
      .andWhere('rp.year = :year', { year })
      .andWhere('rp.quarter = :quarter', { quarter });

    return query.getMany();
  }
}
