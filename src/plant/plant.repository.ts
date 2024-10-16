import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Plant } from '../entities/plant.entity';

export type GetImportLocationsProperties = {
  orisCode: number;
  stackIds: string[];
  unitIds: string[];
};

@Injectable()
export class PlantRepository extends Repository<Plant> {
  constructor(entityManager: EntityManager) {
    super(Plant, entityManager);
  }

  async getImportPlant({
    orisCode,
    stackIds,
    unitIds,
  }: GetImportLocationsProperties): Promise<Plant> {
    let unitsWhere =
      unitIds && unitIds.length > 0 ? 'locationUnit.name IN (:...unitIds)' : '';

    let stacksWhere =
      stackIds && stackIds.length > 0
        ? 'locationStack.name IN (:...stackIds)'
        : '';

    if (unitIds?.length > 0 && stackIds?.length > 0) {
      unitsWhere = `(${unitsWhere})`;
      stacksWhere = ` OR (${stacksWhere})`;
    }

    const q = this.createQueryBuilder('plant')
      .innerJoinAndSelect('plant.monitorPlans', 'monitorPlans')
      .innerJoinAndSelect('monitorPlans.locations', 'monitorLocation')
      .leftJoinAndSelect('monitorLocation.unit', 'locationUnit')
      .leftJoinAndSelect('monitorLocation.stackPipe', 'locationStack')
      .where('plant.oris_code = :orisCode', { orisCode })
      .andWhere('monitorPlans.endRptPeriod is null')
      .andWhere(`(${unitsWhere}${stacksWhere})`, { unitIds, stackIds });

    return q.getOne();
  }
}
