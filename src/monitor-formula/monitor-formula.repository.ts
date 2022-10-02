import { EntityRepository, Repository } from 'typeorm';
import { MonitorFormula } from '../entities/workspace/monitor-formula.entity';

export type GetOneFormulaIdMonLocIdProperties = {
  formulaIdentifier: string;
  monitoringLocationId: string;
};

@EntityRepository(MonitorFormula)
export class MonitorFormulaRepository extends Repository<MonitorFormula> {
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
