import { EntityRepository, Repository } from 'typeorm';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';

export type GetImportLocationsProperties = {
  stackIds: string[];
  unitIds: string[];
};

@EntityRepository(MonitorLocation)
export class MonitorLocationWorkspaceRepository extends Repository<
  MonitorLocation
> {
  async getImportLocations({
    stackIds,
    unitIds,
  }: GetImportLocationsProperties): Promise<MonitorLocation> {
    return this.createQueryBuilder('monitorLocation')
      .where('monitorLocation.unit_id IN(:...unitIds)', { unitIds })
      .orWhere('monitorLocation.stack_pipe_id IN(:...stackIds)', { stackIds })
      .getOne();
  }

  async getLocationsByUnitStackPipeIds(
    facilityId: number,
    unitIds: string[],
    stackPipeIds: string[],
  ): Promise<MonitorLocation[]> {
    let unitsWhere =
      unitIds && unitIds.length > 0
        ? 'up.orisCode = :facilityId AND u.name IN (:...unitIds)'
        : '';

    let stacksWhere =
      stackPipeIds && stackPipeIds.length > 0
        ? 'spp.orisCode = :facilityId AND sp.name IN (:...stackPipeIds)'
        : '';

    if (unitIds?.length > 0 && stackPipeIds?.length > 0) {
      unitsWhere = `(${unitsWhere})`;
      stacksWhere = ` OR (${stacksWhere})`;
    }

    const query = this.createQueryBuilder('ml')
      .leftJoinAndSelect('ml.monitorSystems', 'ms')
      .leftJoinAndSelect('ml.components', 'c')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoin('u.plant', 'up')
      .leftJoinAndSelect('ml.stackPipe', 'sp')
      .leftJoin('sp.plant', 'spp')
      .where(`${unitsWhere}${stacksWhere}`, {
        facilityId,
        unitIds,
        stackPipeIds,
      });
    
    return query.getMany();
  }
}
