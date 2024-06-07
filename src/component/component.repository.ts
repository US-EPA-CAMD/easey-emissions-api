import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Component } from '../entities/component.entity';

@Injectable()
export class ComponentRepository extends Repository<Component> {
  constructor(entityManager: EntityManager) {
    super(Component, entityManager);
  }

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
