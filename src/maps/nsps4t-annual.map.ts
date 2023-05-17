import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { Nsps4tAnnual } from '../entities/nsps4t-annual.entity';
import { Nsps4tAnnual as Nsps4tAnnualWorkspace } from '../entities/workspace/nsps4t-annual.entity';
import { Nsps4tAnnualDTO } from '../dto/nsps4t-annual.dto';

export class Nsps4tAnnualMap extends BaseMap<
  Nsps4tAnnual | Nsps4tAnnualWorkspace,
  Nsps4tAnnualDTO
> {
  public async one(
    entity: Nsps4tAnnual | Nsps4tAnnualWorkspace,
  ): Promise<Nsps4tAnnualDTO> {
    return {
      id: entity.id,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      nsps4tSumId: entity.nsps4tSumId,
      monitoringLocationId: entity.monitoringLocationId,
      reportingPeriodId: entity.reportingPeriodId,
      annualEnergySold: entity.annualEnergySold,
      annualEnergySoldTypeCode: entity.annualEnergySoldTypeCode,
      annualPotentialElectricOutput: entity.annualPotentialElectricOutput,
    };
  }
}
