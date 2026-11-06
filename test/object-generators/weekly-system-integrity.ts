import { faker } from '@faker-js/faker';
import { optionalValue } from './util';

export const genWeeklySystemIntegrity = <RepoType>(amount = 1): RepoType[] => {
  const weeklyTestSumValues: RepoType[] = [];
  for (
    let weeklySystemIntegrityCount = 0;
    weeklySystemIntegrityCount < amount;
    weeklySystemIntegrityCount++
  ) {
    weeklyTestSumValues.push(({
      id: faker.string.sample(),
      weeklyTestSumId: faker.string.sample(),
      calcSystemIntegrityError: optionalValue(faker.number.int()),
      calcApsInd: optionalValue(faker.number.int()),
      userId: optionalValue(faker.string.sample()),
      addDate: optionalValue(faker.date.anytime()),
      updateDate: optionalValue(faker.date.anytime()),
      reportingPeriodId: faker.number.int({ min: 1, max: 38 }),
      monitoringLocationId: faker.string.sample(45),
      gasLevelCode: optionalValue(faker.string.sample()),
      referenceValue: optionalValue(faker.number.int()),
      measuredValue: optionalValue(faker.number.int()),
      apsIndicator: optionalValue(faker.number.int()),
      systemIntegrityError: optionalValue(faker.number.int()),
    } as unknown) as RepoType);
  }

  return weeklyTestSumValues;
};
