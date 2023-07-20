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
            id: faker.datatype.string(),
            reportingPeriodId: faker.datatype.string(),
            monitoringLocationId: faker.datatype.string(),
            date: faker.datatype.datetime(),
            dailyNoxEmissions: faker.datatype.number(),
            dailyHeatInput: faker.datatype.number(),
            dailyAverageNoxRate: faker.datatype.number(),
            dailyNoxExceedence: faker.datatype.number(),
            cumulativeOsNoxExceedence: faker.datatype.number(),
            userId: faker.datatype.string(),
            addDate: faker.datatype.datetime(),
            updateDate: faker.datatype.datetime(),
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
