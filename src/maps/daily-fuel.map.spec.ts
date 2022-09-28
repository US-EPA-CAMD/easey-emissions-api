import { DailyFuelMap } from './daily-fuel.map';
import { genDailyFuel } from '../../test/object-generators/daily-fuel';
import { DailyFuel } from '../entities/daily-fuel.entity';

describe('DailFuelMap', () => {
  let map: DailyFuelMap;

  beforeAll(() => {
    map = new DailyFuelMap();
  });

  it('should map values correctly', async function() {
    const mocks = [
      genDailyFuel(1)[0],
      genDailyFuel(1, { include: ['dailyEmission'] })[0],
    ];

    const expectOne = async (mock: DailyFuel) => {
      await expect(map.one(mock)).resolves.toEqual({
        fuelCode: mock.fuelCode,
        dailyFuelFeed: mock.dailyFuelFeed,
        carbonContentUsed: mock.carbonContentUsed,
        fuelCarbonBurned: mock.fuelCarbonBurned,
        id: mock.id,
        dailyEmissionId: mock.dailyEmissionId,
        calcFuelCarbonBurned: mock.calcFuelCarbonBurned,
        userId: mock.userId,
        addDate: mock.addDate,
        updateDate: mock.updateDate,
        reportingPeriodId: mock.reportingPeriodId,
        monitoringLocationId: mock.monitoringLocationId,
      });
    };

    await Promise.all(
      mocks.map(mock => {
        return expectOne((mock as unknown) as DailyFuel);
      }),
    );
  });
});
