import { faker } from '@faker-js/faker';
import { optionalValue } from './util';
import { HrlyFuelFlow } from '../../src/entities/hrly-fuel-flow.entity';
import { MonitorFormula } from '../../src/entities/monitor-formula.entity';
import { genMonitorFormula } from './monitor-formula';
import { MonitorSystem } from '../../src/entities/monitor-system.entity';
import { genMonitorLocation } from './monitor-location';

export const genHourlyParamFuelFlow = <RepoType>(amount = 1): RepoType[] => {
  const hourlyParamFuelFlows: RepoType[] = [];

  for (let param = 0; param < amount; param++) {
    hourlyParamFuelFlows.push({
      id: faker.string.sample(),
      hourlyFuelFlowId: faker.string.sample(),
      monitoringSystemId: optionalValue(faker.string.sample()),
      formulaId: optionalValue(faker.string.sample()),
      parameterCode: faker.string.sample(),
      parameterValueForFuel: optionalValue(faker.number.int()),
      calcParamValFuel: optionalValue(faker.number.int()),
      sampleTypeCode: optionalValue(faker.string.sample()),
      operatingConditionCode: optionalValue(faker.string.sample()),
      segmentNumber: optionalValue(faker.number.int()),
      userId: optionalValue(faker.string.sample()),
      addDate: optionalValue(faker.date.soon()),
      updateDate: optionalValue(faker.date.soon()),
      parameterUnitsOfMeasureCode: optionalValue(faker.string.sample()),
      calcAppeStatus: optionalValue(faker.string.sample()),
      reportingPeriodId: faker.number.int(),
      monitoringLocationId: faker.string.sample(),
      hrlyFuelFlow: new HrlyFuelFlow(),
      monitorFormula: genMonitorFormula<MonitorFormula>()[0],
      monitorSystem: new MonitorSystem(),
      monitorLocation: genMonitorLocation()[0],
    } as RepoType);
  }

  return hourlyParamFuelFlows;
};
