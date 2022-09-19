import { EntityRepository, Repository } from 'typeorm';
import { Plant } from '../entities/plant.entity';

export type GetImportLocationsProperties = {
  orisCode: number;
  stackIds: string[];
  unitIds: string[];
};

@EntityRepository(Plant)
export class PlantRepository extends Repository<Plant> {
  async getImportLocations({
    orisCode,
    stackIds,
    unitIds,
  }: GetImportLocationsProperties): Promise<Plant> {
    return this.createQueryBuilder('plant')
      .innerJoinAndSelect('plant.monitorPlans', 'monitorPlans')
      .innerJoinAndSelect('monitorPlans.locations', 'monitorLocation')
      .innerJoinAndSelect('monitorPlans.beginRptPeriod', 'reportingPeriod')
      .leftJoin('monitorLocation.unit', 'locationUnit')
      .leftJoin('monitorLocation.stackPipe', 'locationStack')
      .where('plant.oris_code = :orisCode', { orisCode })
<<<<<<< HEAD
      .andWhere('locationUnit.name IN(:...unitIds)', { unitIds })
      .orWhere('locationStack.name IN(:...stackIds)', { stackIds })
=======
      .andWhere('locationUnit.unitid IN(:...unitIds)', { unitIds })
      .orWhere('locationStack.stack_name IN(:...stackIds)', { stackIds })
>>>>>>> develop
      .getOne();
  }
}
