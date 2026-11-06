import { faker } from '@faker-js/faker';
import { optionalValue } from './util';
import { genMonitorLocation } from './monitor-location';
import { ReportingPeriod } from '../../src/entities/reporting-period.entity';
import { DerivedHrlyValue } from '../../src/entities/workspace/derived-hrly-value.entity';
import { HrlyFuelFlow } from '../../src/entities/workspace/hrly-fuel-flow.entity';
import { HrlyGasFlowMeter } from '../../src/entities/workspace/hrly-gas-flow-meter.entity';
import { MatsDerivedHrlyValue } from '../../src/entities/workspace/mats-derived-hrly-value.entity';
import { MatsMonitorHrlyValue } from '../../src/entities/workspace/mats-monitor-hrly-value.entity';
import { MonitorHrlyValue } from '../../src/entities/workspace/monitor-hrly-value.entity';

type HourlyOpValueConfig = {
  include?: Array<
    | 'monitorLocation'
    | 'reportingPeriod'
    | 'hrlyFuelFlows'
    | 'derivedHrlyValues'
    | 'hrlyGasFlowMeters'
    | 'matsDerivedHourlyValues'
    | 'matsMonitorHourlyValues'
    | 'monitorHourlyValues'
  >;
  monitorLocationAmount?: number;
};

// Using RepoType for workspace/non-workspace
export const genHourlyOpValues = <RepoType>(
  amount = 1,
  config?: HourlyOpValueConfig,
): RepoType[] => {
  const hourlyOpValues: RepoType[] = [];
  for (
    let hourlyOpValueCount = 0;
    hourlyOpValueCount < amount;
    hourlyOpValueCount++
  ) {
    hourlyOpValues.push(({
      id: faker.string.sample(45),
      reportingPeriodId: faker.number.int({ min: 1, max: 38 }),
      monitoringLocationId: faker.string.sample(45),
      beginDate: faker.date.anytime(),
      beginHour: faker.number.int({ min: 0, max: 23 }),
      operatingTime: optionalValue(faker.number.int()),
      hourLoad: optionalValue(faker.number.int()),
      loadRange: optionalValue(faker.number.int()),
      commonStackLoadRange: optionalValue(
        faker.number.int({ min: 0, max: 38 }),
      ),
      fcFactor: optionalValue(faker.number.int()),
      fdFactor: optionalValue(faker.number.int()),
      fwFactor: optionalValue(faker.number.int()),
      fuelCode: optionalValue(faker.string.sample(7)),
      multiFuelFlg: optionalValue(faker.string.sample(1)),
      userId: optionalValue(faker.string.sample(25)),
      addDate: optionalValue(faker.date.anytime()),
      updateDate: optionalValue(faker.date.anytime()),
      loadUnitsOfMeasureCode: optionalValue(faker.string.sample(7)),
      operatingConditionCode: optionalValue(faker.string.sample(7)),
      fuelCdList: optionalValue(faker.string.sample(100)),
      mhhiIndicator: optionalValue(faker.number.int()),
      matsHourLoad: optionalValue(faker.number.int()),
      matsStartupShutdownFlag: faker.string.sample(1),
      calcHourMeasureCode: optionalValue(faker.string.sample(7)),
      monitorLocation: config?.include?.includes('monitorLocation')
        ? genMonitorLocation(config?.monitorLocationAmount)
        : undefined,
      reportingPeriod: config?.include?.includes('reportingPeriod')
        ? new ReportingPeriod()
        : undefined,
      derivedHrlyValues: config?.include?.includes('derivedHrlyValues')
        ? [new DerivedHrlyValue()]
        : undefined,
      hrlyFuelFlows: config?.include?.includes('hrlyFuelFlows')
        ? [new HrlyFuelFlow()]
        : undefined,
      hrlyGasFlowMeters: config?.include?.includes('hrlyGasFlowMeters')
        ? [new HrlyGasFlowMeter()]
        : undefined,
      matsDerivedHourlyValues: config?.include?.includes(
        'matsDerivedHourlyValues',
      )
        ? [new MatsDerivedHrlyValue()]
        : undefined,
      matsMonitorHourlyValues: config?.include?.includes('hrlyFuelFlows')
        ? [new MatsMonitorHrlyValue()]
        : undefined,
      monitorHourlyValues: config?.include?.includes('monitorHourlyValues')
        ? [new MonitorHrlyValue()]
        : undefined,
    } as unknown) as RepoType);
  }
  return hourlyOpValues;
};
