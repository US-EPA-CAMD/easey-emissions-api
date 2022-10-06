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
      id: faker.datatype.string(),
      reportingPeriodId: faker.datatype.number({ min: 1, max: 38 }),
      monitoringLocationId: faker.datatype.string(45),
      date: faker.datatype.datetime(),
      hour: faker.datatype.number({ min: 0, max: 23 }),
      minute: optionalValue(faker.datatype.number()),
      componentId: optionalValue(faker.datatype.string()),
      testTypeCode: faker.datatype.string(),
      testResultCode: faker.datatype.string(),
      spanScaleCode: faker.datatype.string(),
      monitoringSystemRecordId: optionalValue(faker.datatype.string()),
      componentRecordId: faker.datatype.string(),
      calcTestResultCode: optionalValue(faker.datatype.string()),
      userId: optionalValue(faker.datatype.string()),
      addDate: optionalValue(faker.datatype.datetime()),
      updateDate: optionalValue(faker.datatype.datetime()),
      weeklySystemIntegrityData: config?.include.includes(
        'weeklySystemIntegrityData',
      )
        ? new WeeklySystemIntegrity()
        : undefined,
    } as unknown) as RepoType);
  }
  return weeklyTestSumValues;
};
