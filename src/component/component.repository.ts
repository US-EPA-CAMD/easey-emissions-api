import { EntityRepository, Repository } from 'typeorm';
import { Component } from '../entities/component.entity';

@EntityRepository(Component)
export class ComponentRepository extends Repository<Component> {
  async findOneByIdentifierAndLocation(
    componentIdentifier: string,
    monitoringLocationId: string,
  ) {
    return this.createQueryBuilder('component')
      .where('component.component_identifier = :componentIdentifier', {
        componentIdentifier,
      })
      .andWhere('component.mon_loc_id = :monitoringLocationId', {
        monitoringLocationId,
      })
      .getOne();
  }
}
