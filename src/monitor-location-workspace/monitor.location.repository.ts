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
}
