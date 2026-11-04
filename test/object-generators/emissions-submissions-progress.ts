import { faker } from '@faker-js/faker';

export const genEmissionsSubmissionsProgress = <RepoType>(
  amount = 1,
): RepoType[] => {
  const emissions: RepoType[] = [];

  for (let emission = 0; emission < amount; emission++) {
    emissions.push(({
      beginDate: faker.date.anytime(),
      endDate: faker.date.anytime(),
      calendarYear: faker.date.soon().getFullYear(),
      quarter: faker.number.int({ min: 1, max: 4 }),
      submittedPercentage: faker.number.int(),
      submittedCount: faker.number.int(),
      remainingCount: faker.number.int(),
      totalExpectedCount: faker.number.int(),
      gdmUsedPercentage: faker.number.int(),
      gdmUsedCount: faker.number.int(),
      gdmRemainingCount: faker.number.int(),
    } as unknown) as RepoType);
  }

  return emissions;
};
