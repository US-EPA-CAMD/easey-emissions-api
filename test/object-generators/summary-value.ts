import { faker } from "@faker-js/faker";
import { MonitorLocation } from "../../src/entities/workspace/monitor-location.entity";
import { genMonitorLocation } from "./monitor-location";
import { genReportingPeriod } from "./reporting-period";

export const genSummaryValue = <RepoType>(amount=1)=>{
    const summaryValues: RepoType[] = [];

    for( let i=0; i < amount; i++ ){
        const monitorLocation = genMonitorLocation<MonitorLocation>(1)[0];
        const reportingPeriod = genReportingPeriod(1)[0];
        summaryValues.push(({
            id: faker.datatype.string(),
            reportingPeriodId: reportingPeriod?.id,
            monitoringLocationId: monitorLocation?.id,
            parameterCode: faker.datatype.string(),
            currentReportingPeriodTotal: faker.datatype.number(),
            calcCurrentRptPeriodTotal: faker.datatype.number(),
            ozoneSeasonToDateTotal: faker.datatype.number(),
            calcOsTotal: faker.datatype.number(),
            yearToDateTotal: faker.datatype.number(),
            calcYearTotal: faker.datatype.number(),
            userId: faker.datatype.string(),
            addDate: faker.datatype.datetime(),
            updateDate: faker.datatype.datetime(),
            monitorLocation,
            reportingPeriod,
        } as unknown) as RepoType)
    }

    return summaryValues;
}