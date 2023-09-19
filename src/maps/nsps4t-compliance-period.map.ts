import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { Nsps4tCompliancePeriod } from '../entities/nsps4t-compliance-period.entity';
import { Nsps4tCompliancePeriod as Nsps4tCompliancePeriodWorkspace } from '../entities/workspace/nsps4t-compliance-period.entity';
import { Nsps4tCompliancePeriodDTO } from '../dto/nsps4t-compliance-period.dto';

export class Nsps4tCompliancePeriodMap extends BaseMap<
  Nsps4tCompliancePeriod | Nsps4tCompliancePeriodWorkspace,
  Nsps4tCompliancePeriodDTO
> {
  public async one(
    entity: Nsps4tCompliancePeriod | Nsps4tCompliancePeriodWorkspace,
  ): Promise<Nsps4tCompliancePeriodDTO> {
    return {
      id: entity.id,
      nsps4tSumId: entity.nsps4tSumId,
      monitoringLocationId: entity.monitoringLocationId,
      reportingPeriodId: entity.reportingPeriodId,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      beginYear: entity.beginYear,
      beginMonth: entity.beginMonth,
      endYear: entity.endYear,
      endMonth: entity.endMonth,
      averageCO2EmissionRate: entity.averageCo2EmissionRate,
      co2EmissionRateUnitsOfMeasureCode: entity.co2EmissionRateUomCode,
      percentValidOpHours: entity.percentValidOpHours,
      violationOfCO2StandardIndicator: entity.violationOfCo2StandardIndicator,
      violationOfCO2StandardComment: entity.violationOfCo2StandardComment,
    };
  }
}
