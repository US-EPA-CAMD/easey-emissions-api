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
    entity: MatsDerivedHrlyValue | MatsDerivedHrlyValueWorkspace,
  ): Promise<MatsDerivedHourlyValueDTO> {
    const formulaIdentifier = entity.monitorFormula?.formulaId ?? null;

    return {
      id: entity.id,
      hourId: entity.hourId,
      monitoringLocationId: entity.monitoringLocationId,
      reportingPeriodId: entity.reportingPeriodId,
      parameterCode: entity.parameterCode,
      unadjustedHourlyValue: entity.unadjustedHourlyValue,
      modcCode: entity.modcCode,
      formulaIdentifier: formulaIdentifier,
      monitoringFormulaRecordId: entity.monFormId,
      calcUnadjustedHrlyValue: entity.calcUnadjustedHrlyValue,
      calcPctDiluent: entity.calcPctDiluent,
      calcPctMoisture: entity.calcPctMoisture,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
    };
  }
}
