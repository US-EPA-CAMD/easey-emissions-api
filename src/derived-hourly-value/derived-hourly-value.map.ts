import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';
import { DerivedHourlyValueDTO } from '../dto/derived-hourly-value.dto';

@Injectable()
export class DerivedHourlyValueMap extends BaseMap<
  DerivedHrlyValue,
  DerivedHourlyValueDTO
> {
  async one(entity: DerivedHrlyValue): Promise<DerivedHourlyValueDTO> {
    return {
      id: entity.id,
      monitoringSystemId: entity.monSysId,
      reportingPeriodId: entity.rptPeriodId,
      parameterCode: entity.parameterCode,
      unadjustedHourlyValue: entity.unadjustedHrlyValue,
      adjustedHourlyValue: entity.adjustedHrlyValue,
      modcCode: entity.modcCode,
      formulaIdentifier: entity.monFormId,
      percentAvailable: entity.pctAvailable,
      operatingConditionCode: entity.operatingConditionCode,
      segmentNumber: entity.segmentNum,
      fuelCode: entity.fuelCode,
      hourId: entity.hourId,
      biasAdjustmentFactor: entity.applicableBiasAdjFactor,
      calcUnadjustedHrlyValue: entity.calcUnadjustedHrlyValue,
      calcAdjustedHrlyValue: entity.calcAdjustedHrlyValue,
      diluentCapInd: entity.diluentCapInd,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      calcPctDiluent: entity.calcPctDiluent,
      calcPctMoisture: entity.calcPctMoisture,
      calcRataStatus: entity.calcRataStatus,
      calcAppeStatus: entity.calcAppeStatus,
      monitoringLocationId: entity.monitorLocationId,
      calcFuelFlowTotal: entity.calcFuelFlowTotal,
      calcHourMeasureCode: entity.calcHourMeasureCode,
    };
  }
}
