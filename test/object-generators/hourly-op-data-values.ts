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
      id: faker.datatype.string(45),
      reportingPeriodId: faker.datatype.number({ min: 1, max: 38 }),
      monitoringLocationId: faker.datatype.string(45),
      beginDate: faker.datatype.datetime(),
      beginHour: faker.datatype.number({ min: 0, max: 23 }),
      operatingTime: optionalValue(faker.datatype.number()),
      hourLoad: optionalValue(faker.datatype.number()),
      loadRange: optionalValue(faker.datatype.number()),
      commonStackLoadRange: optionalValue(
        faker.datatype.number({ min: 0, max: 38 }),
      ),
      fcFactor: optionalValue(faker.datatype.number()),
      fdFactor: optionalValue(faker.datatype.number()),
      fwFactor: optionalValue(faker.datatype.number()),
      fuelCode: optionalValue(faker.datatype.string(7)),
      multiFuelFlg: optionalValue(faker.datatype.string(1)),
      userId: optionalValue(faker.datatype.string(25)),
      addDate: optionalValue(faker.datatype.datetime()),
      updateDate: optionalValue(faker.datatype.datetime()),
      loadUnitsOfMeasureCode: optionalValue(faker.datatype.string(7)),
      operatingConditionCode: optionalValue(faker.datatype.string(7)),
      fuelCdList: optionalValue(faker.datatype.string(100)),
      mhhiIndicator: optionalValue(faker.datatype.number()),
      matsHourLoad: optionalValue(faker.datatype.number()),
      matsStartupShutdownFlag: faker.datatype.string(1),
      calcHourMeasureCode: optionalValue(faker.datatype.string(7)),
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
