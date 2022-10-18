import { genDerivedHrlyValues } from '../../test/object-generators/derived-hourly-value';
import { DerivedHourlyValueMap } from './derived-hourly-value.map';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';

describe('DerivedHourlyValueMap', () => {
  let map: DerivedHourlyValueMap;

  beforeAll(() => {
    map = new DerivedHourlyValueMap();
  });

  it('should map one value correctly', async function() {
    const derivedHourlyValues = genDerivedHrlyValues<DerivedHrlyValue>(3, {
      include: ['monitorSystem', 'monitorFormula'],
    });

    for (const derivedHourlyValue of derivedHourlyValues) {
      await expect(map.one(derivedHourlyValue)).resolves.toEqual({
        id: derivedHourlyValue.id,
        hourId: derivedHourlyValue.hourId,
        monitoringSystemRecordId: derivedHourlyValue.monSysId,
        monitoringSystemId:
          derivedHourlyValue?.monitorSystem?.monitoringSystemId ?? null,
        reportingPeriodId: derivedHourlyValue.rptPeriodId,
        parameterCode: derivedHourlyValue.parameterCode,
        unadjustedHourlyValue: derivedHourlyValue.unadjustedHrlyValue,
        adjustedHourlyValue: derivedHourlyValue.adjustedHrlyValue,
        modcCode: derivedHourlyValue.modcCode,
        formulaIdentifier:
          derivedHourlyValue?.monitorFormula?.formulaId ?? null,
        monitoringFormulaRecordId: derivedHourlyValue.monFormId,
        percentAvailable: derivedHourlyValue.pctAvailable,
        operatingConditionCode: derivedHourlyValue.operatingConditionCode,
        segmentNumber: derivedHourlyValue.segmentNum,
        fuelCode: derivedHourlyValue.fuelCode,
        biasAdjustmentFactor: derivedHourlyValue.applicableBiasAdjFactor,
        calcUnadjustedHrlyValue: derivedHourlyValue.calcUnadjustedHrlyValue,
        calcAdjustedHrlyValue: derivedHourlyValue.calcAdjustedHrlyValue,
        diluentCapInd: derivedHourlyValue.diluentCapInd,
        userId: derivedHourlyValue.userId,
        addDate: derivedHourlyValue.addDate,
        updateDate: derivedHourlyValue.updateDate,
        calcPctDiluent: derivedHourlyValue.calcPctDiluent,
        calcPctMoisture: derivedHourlyValue.calcPctMoisture,
        calcRataStatus: derivedHourlyValue.calcRataStatus,
        calcAppeStatus: derivedHourlyValue.calcAppeStatus,
        monitoringLocationId: derivedHourlyValue.monitorLocationId,
        calcFuelFlowTotal: derivedHourlyValue.calcFuelFlowTotal,
        calcHourMeasureCode: derivedHourlyValue.calcHourMeasureCode,
      });
    }
  });
});
