import { EntityRepository, Repository } from 'typeorm';
import { Plant } from '../entities/plant.entity';

export type GetImportLocationProperties = {
  orisCode: number;
  stackIds: string[];
  unitIds: string[];
};

@EntityRepository(Plant)
export class PlantRepository extends Repository<Plant> {
  async getImportLocation({
    orisCode,
    stackIds,
    unitIds,
  }: GetImportLocationProperties): Promise<Plant> {
    return this.createQueryBuilder('plant')
      .innerJoinAndSelect('plant.monitorPlans', 'monitorPlans')
      .innerJoinAndSelect('monitorPlans.locations', 'monitorLocation')
      .innerJoinAndSelect('monitorPlans.beginRptPeriod', 'reportingPeriod')
      .leftJoin('monitorLocation.unit', 'locationUnit')
      .leftJoin('monitorLocation.stackPipe', 'locationStack')
      .where('plant.oris_code = :orisCode', { orisCode })
      .andWhere('locationUnit.unit_id IN(:...unitIds)', { unitIds })
      .orWhere('locationStack.stack_pipe_id IN(:...stackIds)', { stackIds })
      .getOne();
  }
}
