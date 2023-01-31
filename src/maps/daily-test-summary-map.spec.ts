import { DailyTestSummaryMap } from './daily-test-summary.map';
import { genDailyTestSummary } from '../../test/object-generators/daily-test-summary';
import { DailyTestSummary } from '../entities/daily-test-summary.entity';

describe('DailyTestSummaryMap', () => {
  let map: DailyTestSummaryMap;

  beforeAll(() => {
    map = new DailyTestSummaryMap();
  });

  it('should map values correctly', async function() {
    const mocks = [
      genDailyTestSummary(1),
      genDailyTestSummary(1, {
        include: ['dailyCalibrations'],
      }),
      genDailyTestSummary(1, {
        include: ['monitorLocation'],
      }),
      genDailyTestSummary(1, { include: ['monitorSystem'] }),
      genDailyTestSummary(1, { include: ['component'] }),
      genDailyTestSummary(1, {
        include: [
          'dailyCalibrations',
          'monitorLocation',
          'monitorSystem',
          'component',
        ],
      }),
    ];

    const expectOne = async (mock: DailyTestSummary) => {
      await expect(map.one(mock)).resolves.toEqual({
        id: mock.id,
        monitoringLocationId: mock.monitoringLocationId,
        stackPipeId: mock?.monitorLocation?.stackPipeId ?? null,
        unitId: mock?.monitorLocation?.unit?.name ?? null,
        reportingPeriodId: mock.reportingPeriodId,
        date: mock.date,
        hour: mock.hour,
        minute: mock.minute,
        monitoringSystemId: mock?.monitorSystem?.monitoringSystemId ?? null,
        componentId: mock.component?.componentId ?? null,
        testTypeCode: mock.testTypeCode,
        testResultCode: mock.testResultCode,
        calcTestResultCode: mock.calcTestResultCode,
        spanScaleCode: mock.spanScaleCode,
        userId: mock.userId,
        addDate: mock.addDate,
        updateDate: mock.updateDate,
        dailyCalibrationData: mock?.dailyCalibrations ?? [],
      });
    };

    for (const mock of mocks) {
      await expectOne((mock as unknown) as DailyTestSummary);
    }
  });
});
