import { DailyCalibrationMap } from './daily-calibration.map';
import { genDailyCalibration } from '../../test/object-generators/daily-calibration';
import { DailyCalibration } from '../entities/daily-calibration.entity';

describe('DailyCalibrationMap', () => {
  let map: DailyCalibrationMap;

  beforeAll(() => {
    map = new DailyCalibrationMap();
  });

  it('should map values correctly', async function() {
    const mocks = genDailyCalibration(3);

    const expectOne = async (mock: DailyCalibration) => {
      await expect(map.one(mock)).resolves.toEqual({
        id: mock.id,
        dailyTestSumId: mock.dailyTestSummaryId,
        reportingPeriodId: mock.reportingPeriodId,
        onLineOffLineIndicator: mock.onLineOffLineIndicator,
        calcOnlineOfflineIndicator: mock.calcOnlineOfflineIndicator,
        upscaleGasCode: mock.upscaleGasCode,
        zeroInjectionDate: mock.zeroInjectionDate,
        zeroInjectionHour: mock.zeroInjectionHour,
        zeroInjectionMinute: mock.zeroInjectionMinute,
        upscaleInjectionDate: mock.upscaleInjectionDate,
        upscaleInjectionHour: mock.upscaleInjectionHour,
        upscaleInjectionMinute: mock.upscaleInjectionMinute,
        zeroMeasuredValue: mock.zeroMeasuredValue,
        upscaleMeasuredValue: mock.upscaleMeasuredValue,
        zeroAPSIndicator: mock.zeroApsIndicator,
        calcZeroApsIndicator: mock.calcZeroApsIndicator,
        upscaleAPSIndicator: mock.upscaleApsIndicator,
        calcUpscaleApsIndicator: mock.calcUpscaleApsIndicator,
        zeroCalibrationError: mock.zeroCalibrationError,
        calcZeroCalibrationError: mock.calcZeroCalibrationError,
        upscaleCalibrationError: mock.upscaleCalibrationError,
        calcUpscaleCalibrationError: mock.calcUpscaleCalibrationError,
        zeroReferenceValue: mock.zeroReferenceValue,
        upscaleReferenceValue: mock.upscaleReferenceValue,
        upscaleGasTypeCode: mock.upscaleGasTypeCode,
        cylinderIdentifier: mock.cylinderIdentifier,
        vendorIdentifier: mock.vendorIdentifier,
        expirationDate: mock.expirationDate,
        injectionProtocolCode: mock.injectionProtocolCode,
        userId: mock.userId,
        addDate: mock.addDate?.toISOString() ?? null,
        updateDate: mock.updateDate?.toISOString() ?? null,
      });
    };

    await Promise.all(
      mocks.map(mock => {
        return expectOne((mock as unknown) as DailyCalibration);
      }),
    );
  });
});
