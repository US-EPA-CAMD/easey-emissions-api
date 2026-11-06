import { faker } from '@faker-js/faker';
import { optionalValue } from './util';
import { genReportingPeriod } from './reporting-period';
import { genMonitorLocation } from './monitor-location';
import { genDailyFuel } from './daily-fuel';

type GenDailyEmissionConfig = {
  include?: Array<'reportingPeriod' | 'monitorLocation' | 'dailyFuelData'>;
  dailyFuelDataAmount?: number;
};

export const genDailyEmission = <RepoType>(
  amount = 1,
  config?: GenDailyEmissionConfig,
) => {
  const dailyEmissions: RepoType[] = [];

  for (let dailyEmission = 0; dailyEmission < amount; dailyEmission++) {
    dailyEmissions.push(({
      id: faker.string.sample(),
      reportingPeriodId: faker.number.int(),
      monitoringLocationId: faker.string.sample(),
      parameterCode: faker.string.sample(),
      date: faker.date.soon(),
      totalDailyEmissions: optionalValue(faker.number.int()),
      adjustedDailyEmissions: optionalValue(faker.number.int()),
      sorbentRelatedMassEmissions: optionalValue(faker.number.int()),
      userId: optionalValue(faker.string.sample()),
      addDate: optionalValue(faker.date.soon()),
      updateDate: optionalValue(faker.date.soon()),
      unadjustedDailyEmissions: optionalValue(faker.number.int()),
      totalCarbonBurned: optionalValue(faker.number.int()),
      calcTotalDailyEmissions: optionalValue(faker.number.int()),
      calcTotalOpTime: optionalValue(faker.number.int()),
      reportingPeriod:
        config?.include?.includes('reportingPeriod') === true
          ? genReportingPeriod()[0]
          : undefined,
      monitorLocation:
        config?.include?.includes('monitorLocation') === true
          ? genMonitorLocation()[0]
          : undefined,
      dailyFuelData:
        config?.include?.includes('dailyFuelData') === true
          ? genDailyFuel(config?.dailyFuelDataAmount)
          : undefined,
    } as unknown) as RepoType);
  }

  return dailyEmissions;
};
