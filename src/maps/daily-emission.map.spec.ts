import { DailyEmissionMap } from './daily-emission.map';
import { genDailyEmission } from '../../test/object-generators/daily-emission';
import { DailyEmission } from '../entities/daily-emission.entity';

describe('DailyEmissionMap', () => {
  let map: DailyEmissionMap;

  beforeAll(() => {
    map = new DailyEmissionMap();
  });

  it('should map values correctly', async function() {
    const mocks = [
      genDailyEmission(1)[0],
      genDailyEmission(1, {
        include: ['dailyFuelData'],
        dailyFuelDataAmount: 2,
      })[0],
      genDailyEmission(1, {
        include: ['dailyFuelData', 'monitorLocation', 'reportingPeriod'],
      })[0],
    ];

    const expectOne = async (mock: DailyEmission) => {
      await expect(map.one(mock)).resolves.toEqual({
        id: mock.id,
        reportingPeriodId: mock.reportingPeriodId,
        monitoringLocationId: mock.monitoringLocationId,
        stackPipeId: mock?.monitorLocation?.stackPipe?.name ?? null,
        unitId: mock?.monitorLocation?.unit?.name ?? null,
        parameterCode: mock.parameterCode,
        date: mock.date,
        totalDailyEmissions: mock.totalDailyEmissions,
        adjustedDailyEmissions: mock.adjustedDailyEmissions,
        sorbentRelatedMassEmissions: mock.sorbentRelatedMassEmissions,
        unadjustedDailyEmissions: mock.unadjustedDailyEmissions,
        totalCarbonBurned: mock.totalCarbonBurned,
        userId: mock.userId,
        addDate: mock.addDate?.toISOString() ?? null,
        updateDate: mock.updateDate?.toISOString() ?? null,
        calcTotalDailyEmissions: mock.calcTotalDailyEmissions,
        calcTotalOpTime: mock.calcTotalOpTime,
        dailyFuelData: [],
      });
    };

    await Promise.all(
      mocks.map(mock => {
        return expectOne((mock as unknown) as DailyEmission);
      }),
    );
  });
});
