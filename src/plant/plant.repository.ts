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
      .innerJoinAndSelect('monitorPlans.beginRptPeriod', 'reportingPeriod')
      .leftJoinAndSelect('monitorPlans.endRptPeriod', 'endReportingPeriod')
      .leftJoin('monitorLocation.unit', 'locationUnit')
      .leftJoin('monitorLocation.stackPipe', 'locationStack')
      .where('plant.oris_code = :orisCode', { orisCode })
      .andWhere(`${unitsWhere}${stacksWhere}`, { unitIds, stackIds });

    return q.getOne();
  }
}
