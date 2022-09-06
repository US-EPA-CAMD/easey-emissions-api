import { faker } from '@faker-js/faker';

export const genEmissionsSubmissionsProgress = <RepoType>(
  amount = 1,
): RepoType[] => {
  const emissions: RepoType[] = [];

  for (let emission = 0; emission < amount; emission++) {
    emissions.push(({
      beginDate: faker.datatype.datetime(),
      endDate: faker.datatype.datetime(),
      calendarYear: faker.date.soon().getFullYear(),
      quarter: faker.datatype.number({ min: 1, max: 4 }),
      submittedPercentage: faker.datatype.number(),
      submittedCount: faker.datatype.number(),
      remainingCount: faker.datatype.number(),
      totalExpectedCount: faker.datatype.number(),
      gdmUsedPercentage: faker.datatype.number(),
      gdmUsedCount: faker.datatype.number(),
      gdmRemainingCount: faker.datatype.number(),
    } as unknown) as RepoType);
  }

  return emissions;
};
