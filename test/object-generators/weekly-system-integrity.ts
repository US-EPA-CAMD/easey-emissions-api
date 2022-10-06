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
      id: faker.datatype.string(),
      weeklyTestSumId: faker.datatype.string(),
      calcSystemIntegrityError: optionalValue(faker.datatype.number()),
      calcApsInd: optionalValue(faker.datatype.number()),
      userId: optionalValue(faker.datatype.string()),
      addDate: optionalValue(faker.datatype.datetime()),
      updateDate: optionalValue(faker.datatype.datetime()),
      reportingPeriodId: faker.datatype.number({ min: 1, max: 38 }),
      monitoringLocationId: faker.datatype.string(45),
      gasLevelCode: optionalValue(faker.datatype.string()),
      referenceValue: optionalValue(faker.datatype.number()),
      measuredValue: optionalValue(faker.datatype.number()),
      apsIndicator: optionalValue(faker.datatype.number()),
      systemIntegrityError: optionalValue(faker.datatype.number()),
    } as unknown) as RepoType);
  }

  return weeklyTestSumValues;
};
