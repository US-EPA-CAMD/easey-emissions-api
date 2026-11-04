import { faker } from '@faker-js/faker';
import { genMonitorLocation } from './monitor-location';
import { genReportingPeriod } from './reporting-period';

type GenDailyBackstopConfig = {
    include?: Array<'monitorLocation' | 'reportingPeriod'>;
};

export const genDailyBackstop = <RepoType>(
    amount = 1,
    config?: GenDailyBackstopConfig,
) => {
    const dailyBackstopData: RepoType[] = [];

    for (let i = 0; i < amount; i++) {
        dailyBackstopData.push(({
            id: faker.string.sample(),
            reportingPeriodId: faker.string.sample(),
            monitoringLocationId: faker.string.sample(),
            date: faker.date.anytime(),
            dailyNoxEmissions: faker.number.int(),
            dailyHeatInput: faker.number.int(),
            dailyAverageNoxRate: faker.number.int(),
            dailyNoxExceedance: faker.number.int(),
            cumulativeOsNoxExceedance: faker.number.int(),
            userId: faker.string.sample(),
            updateDate: faker.date.anytime(),
            monitorLocation: config?.include?.includes('monitorLocation')
                ? genMonitorLocation()[0]
                : undefined,
            reportingPeriod: config?.include?.includes('reportingPeriod')
                ? genReportingPeriod()[0]
                : undefined,
        } as unknown) as RepoType);
    }

    return dailyBackstopData;
};
