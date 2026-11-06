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
      id: faker.string.sample(45),
      hourId: faker.string.sample(45),
      componentId: faker.string.sample(3),
      componentRecordId: faker.string.sample(45),
      monitoringLocationId: faker.string.sample(45),
      reportingPeriodId: faker.number.int(38),
      beginEndHourFlag: faker.string.sample(7),
      hourlyGFMReading: faker.number.int(13),
      averageHourlySamplingRate: faker.number.int(13),
      samplingRateUnitsOfMeasureCode: faker.string.sample(7),
      hourlySFSRRatio: faker.number.int(4),
      calcFlowToSamplingRatio: faker.number.int(4),
      calcFlowToSamplingMult: faker.number.int(4),
      userId: faker.string.sample(25),
      addDate: faker.date.anytime(),
      updateDate: faker.date.anytime(),
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
