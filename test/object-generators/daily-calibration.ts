import { faker } from '@faker-js/faker';
import { genDailyTestSummary } from './daily-test-summary';
import { optionalValue } from './util';

type GenDailyCalibration = {
  include?: Array<'dailyTestSummary'>;
};

export const genDailyCalibration = <RepoType>(
  amount = 1,
  config?: GenDailyCalibration,
): RepoType[] => {
  const calibrations: RepoType[] = [];
  for (let calibration = 0; calibration < amount; calibration++) {
    calibrations.push(({
      id: faker.string.sample(),
      dailyTestSummaryId: faker.string.sample(45),
      onlineOfflineIndicator: faker.string.sample(45),
      calcOnlineOfflineIndicator: optionalValue(faker.number.float()),
      upscaleGasCode: optionalValue(faker.string.sample(7)),
      zeroInjectionDate: optionalValue(faker.date.anytime()),
      zeroInjectionHour: optionalValue(faker.number.int()),
      zeroInjectionMinute: optionalValue(faker.number.int()),
      upscaleInjectionDate: optionalValue(faker.date.anytime()),
      upscaleInjectionHour: optionalValue(faker.number.int()),
      upscaleInjectionMinute: optionalValue(faker.number.int()),
      zeroMeasuredValue: optionalValue(
        faker.number.float({ multipleOf: 0.001 }),
      ),
      upscaleMeasuredValue: optionalValue(
        faker.number.float({ multipleOf: 0.001 }),
      ),
      zeroApsIndicator: optionalValue(faker.number.int()),
      calcZeroApsIndicator: optionalValue(faker.number.int()),
      upscaleApsIndicator: optionalValue(faker.number.int()),
      calcUpscaleApsIndicator: optionalValue(faker.number.int()),
      zeroCalibrationError: optionalValue(
        faker.number.float({ multipleOf: 0.01 }),
      ),
      calcZeroCalibrationError: optionalValue(
        faker.number.float({ multipleOf: 0.01 }),
      ),
      upscaleCalibrationError: optionalValue(
        faker.number.float({ multipleOf: 0.01 }),
      ),
      calcUpscaleCalibrationError: optionalValue(
        faker.number.float({ multipleOf: 0.01 }),
      ),
      zeroReferenceValue: optionalValue(
        faker.number.float({ multipleOf: 0.001 }),
      ),
      upscaleReferenceValue: optionalValue(
        faker.number.float({ multipleOf: 0.001 }),
      ),
      userId: optionalValue(faker.string.sample()),
      addDate: optionalValue(faker.date.anytime()),
      updateDate: optionalValue(faker.date.anytime()),
      reportingPeriodId: optionalValue(faker.number.int()),
      upscaleGasTypeCode: optionalValue(faker.string.sample()),
      vendorIdentifier: optionalValue(faker.string.sample()),
      cylinderIdentifier: optionalValue(faker.string.sample()),
      expirationDate: optionalValue(faker.date.anytime()),
      injectionProtocolCode: optionalValue(faker.string.sample()),
      dailyTestSummary:
        config?.include?.includes('dailyTestSummary') === true
          ? genDailyTestSummary()[0]
          : undefined,
    } as unknown) as RepoType);
  }

  return calibrations;
};
