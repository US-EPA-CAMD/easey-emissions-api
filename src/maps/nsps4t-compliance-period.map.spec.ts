import { Nsps4tCompliancePeriodMap } from './nsps4t-compliance-period.map';
import { genNsps4tCompliancePeriod } from '../../test/object-generators/nsps4t-compliance-period';
import { Nsps4tCompliancePeriod } from '../entities/nsps4t-compliance-period.entity';

describe('NSPS4TCompliancePeriodMap', () => {
  let map: Nsps4tCompliancePeriodMap;

  beforeAll(() => {
    map = new Nsps4tCompliancePeriodMap();
  });

  it('should map value correctly', async function() {
    const params = genNsps4tCompliancePeriod<Nsps4tCompliancePeriod>(3);

    await expect(map.many(params)).resolves.toEqual(
      params.map(param => {
        return {
          id: param.id,
          nsps4tSumId: param.nsps4tSumId,
          monitoringLocationId: param.monitoringLocationId,
          reportingPeriodId: param.reportingPeriodId,
          userId: param.userId,
          addDate: param.addDate?.toISOString() ?? null,
          updateDate: param.updateDate?.toISOString() ?? null,
          beginYear: param.beginYear,
          beginMonth: param.beginMonth,
          endYear: param.endYear,
          endMonth: param.endMonth,
          averageCo2EmissionRate: param.averageCo2EmissionRate,
          co2EmissionRateUomCode: param.co2EmissionRateUomCode,
          percentValidOpHours: param.percentValidOpHours,
          violationOfCo2StandardIndicator:
            param.violationOfCo2StandardIndicator,
          violationOfCo2StandardComment: param.violationOfCo2StandardComment,
        };
      }),
    );
  });
});
