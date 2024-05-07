import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorFormula } from '../entities/workspace/monitor-formula.entity';

export type GetOneFormulaIdMonLocIdProperties = {
  formulaIdentifier: string;
  monitoringLocationId: string;
};

@Injectable()
export class MonitorFormulaRepository extends Repository<MonitorFormula> {
  constructor(entityManager: EntityManager) {
    super(MonitorFormula, entityManager);
  }

  async getOneFormulaIdsMonLocId({
    formulaIdentifier,
    monitoringLocationId,
  }: GetOneFormulaIdMonLocIdProperties): Promise<MonitorFormula> {
    return this.findOne({
      where: {
        monitoringLocationId,
        formulaId: formulaIdentifier,
      },
    });
  }
}
