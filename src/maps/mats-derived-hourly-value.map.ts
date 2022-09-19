import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MatsDerivedHourlyValueDTO } from '../dto/mats-derived-hourly-value.dto';
import { MatsDerivedHrlyValue } from '../entities/mats-derived-hrly-value.entity';
import { MatsDerivedHrlyValue as MatsDerivedHrlyValueWorkspace } from '../entities/workspace/mats-derived-hrly-value.entity';

@Injectable()
export class MatsDerivedHourlyValueMap extends BaseMap<
  MatsDerivedHrlyValue | MatsDerivedHrlyValueWorkspace,
  MatsDerivedHourlyValueDTO
> {
  public async one(
    entity: MatsDerivedHrlyValue,
  ): Promise<MatsDerivedHourlyValueDTO> {
    return {
      id: entity.id,
      hourId: entity.hourId,
      monitoringLocationId: entity.monitoringLocationId,
      reportingPeriodId: entity.reportingPeriodId,
      parameterCode: entity.parameterCode,
      unadjustedHourlyValue: entity.unadjustedHourlyValue,
      modcCode: entity.modcCode,
      formulaIdentifier: entity.formulaIdentifier,
      calcUnadjustedHrlyValue: entity.calcUnadjustedHrlyValue,
      calcPctDiluent: entity.calcPctDiluent,
      calcPctMoisture: entity.calcPctMoisture,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
    };
  }
}
