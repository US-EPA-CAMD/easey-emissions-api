import { Nsps4tAnnualMap } from './nsps4t-annual.map';
import { genNsps4tAnnual } from '../../test/object-generators/nsps4t-annual';
import { Nsps4tAnnual } from '../entities/nsps4t-annual.entity';

describe('NSPS4TAnnualMap', () => {
  let map: Nsps4tAnnualMap;

  beforeAll(() => {
    map = new Nsps4tAnnualMap();
  });

  it('should map value correctly', async function() {
    const params = genNsps4tAnnual<Nsps4tAnnual>(3);

    await expect(map.many(params)).resolves.toEqual(
      params.map(param => {
        return {
          id: param.id,
          userId: param.userId,
          addDate: param.addDate,
          updateDate: param.updateDate,
          nsps4tSumId: param.nsps4tSumId,
          monitoringLocationId: param.monitoringLocationId,
          reportingPeriodId: param.reportingPeriodId,
          annualEnergySold: param.annualEnergySold,
          annualEnergySoldTypeCode: param.annualEnergySoldTypeCode,
          annualPotentialElectricOutput: param.annualPotentialElectricOutput,
        };
      }),
    );
  });
});
