import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { Nsps4tSummaryDTO } from '../dto/nsps4t-summary.dto';
import { Nsps4tSummary } from '../entities/nsps4t-summary.entity';
import { Nsps4tSummary as Nsps4tSummaryWorkspace } from '../entities/workspace/nsps4t-summary.entity';

export class Nsps4tSummaryMap extends BaseMap<
  Nsps4tSummary | Nsps4tSummaryWorkspace,
  Nsps4tSummaryDTO
> {
  public async one(
    entity: Nsps4tSummary | Nsps4tSummaryWorkspace,
  ): Promise<Nsps4tSummaryDTO> {
    const stackPipeId = entity.monitorLocation?.stackPipe?.name ?? null;
    const unitId = entity.monitorLocation?.unit?.name ?? null;

    return {
      id: entity.id,
      monitoringLocationId: entity.monitoringLocationId,
      reportingPeriodId: entity.reportingPeriodId,
      stackPipeId,
      unitId,
      co2EmissionStandardCode: entity.co2EmissionStandardCode,
      modusValue: entity.modusValue,
      modusUomCode: entity.modusUomCode,
      electricalLoadCode: entity.electricalLoadCode,
      noCompliancePeriodEndedIndicator: entity.noCompliancePeriodEndedIndicator,
      noCompliancePeriodEndedComment: entity.noCompliancePeriodEndedComment,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      nsps4tCompliancePeriodData: [],
      nsps4tFourthQuarterData: [],
    };
  }
}
