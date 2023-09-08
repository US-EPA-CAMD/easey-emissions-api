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
      id: faker.datatype.string(),
      dailyTestSummaryId: faker.datatype.string(45),
      onLineOfflineIndicator: faker.datatype.string(45),
      calcOnlineOfflineIndicator: optionalValue(faker.datatype.float()),
      upscaleGasCode: optionalValue(faker.datatype.string(7)),
      zeroInjectionDate: optionalValue(faker.datatype.datetime()),
      zeroInjectionHour: optionalValue(faker.datatype.number()),
      zeroInjectionMinute: optionalValue(faker.datatype.number()),
      upscaleInjectionDate: optionalValue(faker.datatype.datetime()),
      upscaleInjectionHour: optionalValue(faker.datatype.number()),
      upscaleInjectionMinute: optionalValue(faker.datatype.number()),
      zeroMeasuredValue: optionalValue(
        faker.datatype.number({ precision: 0.001 }),
      ),
      upscaleMeasuredValue: optionalValue(
        faker.datatype.number({ precision: 0.001 }),
      ),
      zeroApsIndicator: optionalValue(faker.datatype.number()),
      calcZeroApsIndicator: optionalValue(faker.datatype.number()),
      upscaleApsIndicator: optionalValue(faker.datatype.number()),
      calcUpscaleApsIndicator: optionalValue(faker.datatype.number()),
      zeroCalibrationError: optionalValue(
        faker.datatype.number({ precision: 0.01 }),
      ),
      calcZeroCalibrationError: optionalValue(
        faker.datatype.number({ precision: 0.01 }),
      ),
      upscaleCalibrationError: optionalValue(
        faker.datatype.number({ precision: 0.01 }),
      ),
      calcUpscaleCalibrationError: optionalValue(
        faker.datatype.number({ precision: 0.01 }),
      ),
      zeroReferenceValue: optionalValue(
        faker.datatype.number({ precision: 0.001 }),
      ),
      upscaleReferenceValue: optionalValue(
        faker.datatype.number({ precision: 0.001 }),
      ),
      userId: optionalValue(faker.datatype.string()),
      addDate: optionalValue(faker.datatype.datetime()),
      updateDate: optionalValue(faker.datatype.datetime()),
      reportingPeriodId: optionalValue(faker.datatype.number()),
      upscaleGasTypeCode: optionalValue(faker.datatype.string()),
      vendorIdentifier: optionalValue(faker.datatype.string()),
      cylinderIdentifier: optionalValue(faker.datatype.string()),
      expirationDate: optionalValue(faker.datatype.datetime()),
      injectionProtocolCode: optionalValue(faker.datatype.string()),
      dailyTestSummary:
        config?.include?.includes('dailyTestSummary') === true
          ? genDailyTestSummary()[0]
          : undefined,
    } as unknown) as RepoType);
  }

  return calibrations;
};
