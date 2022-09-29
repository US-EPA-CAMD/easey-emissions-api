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
      id: faker.datatype.string(),
      reportingPeriodId: faker.datatype.number(),
      monitoringLocationId: faker.datatype.string(),
      dailyEmissionId: faker.datatype.string(),
      fuelCode: faker.datatype.string(),
      dailyFuelFeed: optionalValue(faker.datatype.number()),
      carbonContentUsed: optionalValue(faker.datatype.number()),
      fuelCarbonBurned: optionalValue(faker.datatype.number()),
      calcFuelCarbonBurned: optionalValue(faker.datatype.number()),
      userId: faker.datatype.string(),
      addDate: faker.date.soon(),
      updateDate: optionalValue(faker.date.soon()),
      dailyEmission: config?.include.includes('dailyEmission')
        ? genDailyEmission()[0]
        : undefined,
    } as RepoType);
  }

  return dailyFuelData;
};
