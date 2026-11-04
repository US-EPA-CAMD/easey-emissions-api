import { faker } from '@faker-js/faker';

import { optionalValue } from './util';
import { WeeklySystemIntegrity } from '../../src/entities/workspace/weekly-system-integrity.entity';

type WeeklyTestSumConfig = {
  include?: Array<'weeklySystemIntegrityData'>;
  monitorLocationAmount?: number;
};

// Using RepoType for workspace/non-workspace
export const genWeeklyTestSumValues = <RepoType>(
  amount = 1,
  config?: WeeklyTestSumConfig,
): RepoType[] => {
  const weeklyTestSumValues: RepoType[] = [];
  for (
    let weeklyTestSumValueCount = 0;
    weeklyTestSumValueCount < amount;
    weeklyTestSumValueCount++
  ) {
    weeklyTestSumValues.push(({
      id: faker.string.sample(),
      reportingPeriodId: faker.number.int({ min: 1, max: 38 }),
      monitoringLocationId: faker.string.sample(45),
      date: faker.date.anytime(),
      hour: faker.number.int({ min: 0, max: 23 }),
      minute: optionalValue(faker.number.int()),
      componentId: optionalValue(faker.string.sample()),
      testTypeCode: faker.string.sample(),
      testResultCode: faker.string.sample(),
      spanScaleCode: faker.string.sample(),
      monitoringSystemRecordId: optionalValue(faker.string.sample()),
      componentRecordId: faker.string.sample(),
      calcTestResultCode: optionalValue(faker.string.sample()),
      userId: optionalValue(faker.string.sample()),
      addDate: optionalValue(faker.date.anytime()),
      updateDate: optionalValue(faker.date.anytime()),
      weeklySystemIntegrityData: config?.include.includes(
        'weeklySystemIntegrityData',
      )
        ? new WeeklySystemIntegrity()
        : undefined,
    } as unknown) as RepoType);
  }
  return weeklyTestSumValues;
};
