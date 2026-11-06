import { faker } from '@faker-js/faker';
import { genDailyEmission } from './daily-emission';
import { optionalValue } from './util';

type GenDailyFuelConfig = {
  include?: Array<'dailyEmission'>;
};

export const genDailyFuel = <RepoType>(
  amount = 1,
  config?: GenDailyFuelConfig,
) => {
  const dailyFuelData: RepoType[] = [];

  for (let dailyFuel = 0; dailyFuel < amount; dailyFuel++) {
    dailyFuelData.push({
      id: faker.string.sample(),
      reportingPeriodId: faker.number.int(),
      monitoringLocationId: faker.string.sample(),
      dailyEmissionId: faker.string.sample(),
      fuelCode: faker.string.sample(),
      dailyFuelFeed: optionalValue(faker.number.int()),
      carbonContentUsed: optionalValue(faker.number.int()),
      fuelCarbonBurned: optionalValue(faker.number.int()),
      calcFuelCarbonBurned: optionalValue(faker.number.int()),
      userId: faker.string.sample(),
      addDate: faker.date.soon(),
      updateDate: optionalValue(faker.date.soon()),
      dailyEmission: config?.include.includes('dailyEmission')
        ? genDailyEmission()[0]
        : undefined,
    } as RepoType);
  }

  return dailyFuelData;
};
