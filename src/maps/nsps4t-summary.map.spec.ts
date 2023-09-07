import { Nsps4tSummaryMap } from './nsps4t-summary.map';
import { genNsps4tSummary } from '../../test/object-generators/nsps4t-summary';
import { Nsps4tSummary } from '../entities/nsps4t-summary.entity';
import { hasArrayValues } from '../utils/utils';

describe('NSPS4TSummaryMap', () => {
  let map: Nsps4tSummaryMap;

  beforeAll(() => {
    map = new Nsps4tSummaryMap();
  });

  it('should map values correctly', async function() {
    const params = genNsps4tSummary<Nsps4tSummary>(3);

    await expect(map.many(params)).resolves.toEqual(
      params.map(param => {
        return {
          id: param.id,
          monitoringLocationId: param.monitoringLocationId,
          reportingPeriodId: param.reportingPeriodId,
          stackPipeId: param.monitorLocation?.stackPipe?.name ?? null,
          unitId: param.monitorLocation?.unit?.name ?? null,
          co2EmissionStandardCode: param.co2EmissionStandardCode,
          modusValue: param.modusValue,
          modusUnitsOfMeasureCode: param.modusUomCode,
          electricalLoadCode: param.electricalLoadCode,
          noCompliancePeriodEndedIndicator:
            param.noCompliancePeriodEndedIndicator,
          noCompliancePeriodEndedComment: param.noCompliancePeriodEndedComment,
          userId: param.userId,
          addDate: param.addDate?.toISOString() ?? null,
          updateDate: param.updateDate?.toISOString() ?? null,
          nsps4tCompliancePeriodData: hasArrayValues(
            param.nsps4tCompliancePeriodData,
          )
            ? param.nsps4tCompliancePeriodData
            : [],
          nsps4tFourthQuarterData: hasArrayValues(param.nsps4tAnnualData)
            ? param.nsps4tAnnualData
            : [],
        };
      }),
    );
  });
});
