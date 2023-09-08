import { faker } from '@faker-js/faker';
import { HrlyOpData } from '../../src/entities/hrly-op-data.entity';
import { MonitorLocation } from '../../src/entities/monitor-location.entity';
import { ReportingPeriod } from '../../src/entities/reporting-period.entity';
import { Component } from '../../src/entities/workspace/component.entity';

type GenHourlyGasFlowMeterConfig = {
  include?: Array<
    'hrlyOpData' | 'monitorLocation' | 'reportingPeriod' | 'component'
  >;
};
export const genHourlyGasFlowMeter = <RepoType>(
  amount = 1,
  config?: GenHourlyGasFlowMeterConfig,
): RepoType[] => {
  const hourlyGasFlowMeter: RepoType[] = [];
  for (
    let hourlyGasFlowMeterCount = 0;
    hourlyGasFlowMeterCount < amount;
    hourlyGasFlowMeterCount++
  ) {
    hourlyGasFlowMeter.push(({
      id: faker.datatype.string(45),
      hourId: faker.datatype.string(45),
      componentId: faker.datatype.string(3),
      componentRecordId: faker.datatype.string(45),
      monitoringLocationId: faker.datatype.string(45),
      reportingPeriodId: faker.datatype.number(38),
      beginEndHourFlag: faker.datatype.string(7),
      hourlyGFMReading: faker.datatype.number(13),
      averageHourlySamplingRate: faker.datatype.number(13),
      samplingRateUnitsOfMeasureCode: faker.datatype.string(7),
      hourlySFSRRatio: faker.datatype.number(4),
      calcFlowToSamplingRatio: faker.datatype.number(4),
      calcFlowToSamplingMult: faker.datatype.number(4),
      userId: faker.datatype.string(25),
      addDate: faker.datatype.datetime(),
      updateDate: faker.datatype.datetime(),
      hrlyOpData:
        config?.include.includes('hrlyOpData') === true
          ? new HrlyOpData()
          : undefined,
      monitorLocation:
        config?.include.includes('monitorLocation') === true
          ? new MonitorLocation()
          : undefined,
      reportingPeriod:
        config?.include.includes('reportingPeriod') === true
          ? new ReportingPeriod()
          : undefined,
      component:
        config?.include.includes('component') === true
          ? new Component()
          : undefined,
    } as unknown) as RepoType);
  }
  return hourlyGasFlowMeter;
};
