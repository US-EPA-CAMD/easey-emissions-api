import { genDailyBackstop } from '../../test/object-generators/daily-backstop';
import { DailyBackstop } from '../entities/daily-backstop.entity';
import { DailyBackstop as DailyBackstopWorkspace } from '../entities/workspace/daily-backstop.entity';
import { DailyBackstopMap } from './daily-backstop.map';

describe('Daily Backstop Map Test', () => {
  let map: DailyBackstopMap;
  
  beforeAll(() => {
    map = new DailyBackstopMap();
  });

  it('should map values correctly', async function() {
    const mocks = genDailyBackstop<DailyBackstop>(1);

    const expectOne = async (mock: DailyBackstop | DailyBackstopWorkspace) => {
      await expect(map.one(mock)).resolves.toEqual({
        id: mock.id,
        unitId: mock.monitorLocation?.unit?.name ?? null,
        monitoringLocationId: mock.monitoringLocationId,
        userId: mock.userId,
        addDate: mock.addDate?.toISOString() ?? null,
        updateDate: mock.updateDate?.toISOString() ?? null,
        reportingPeriodId: mock.reportingPeriodId,
        date: mock.date,
        dailyNOxEmissions: mock.dailyNoxEmissions,
        dailyHeatInput: mock.dailyHeatInput,
        dailyAverageNOxRate: mock.dailyAverageNoxRate,
        dailyNOxExceedence: mock.dailyNoxEmissions,
        cumulativeOSNOxExceedence: mock.cumulativeOsNoxExceedence,
  });
    };

    await Promise.all(
      mocks.map(mock => {
        return expectOne((mock as unknown) as DailyBackstop);
      }),
    );
  });
});
