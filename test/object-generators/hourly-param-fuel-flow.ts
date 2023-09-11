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
      id: faker.datatype.string(),
      hourlyFuelFlowId: faker.datatype.string(),
      monitoringSystemId: optionalValue(faker.datatype.string()),
      formulaId: optionalValue(faker.datatype.string()),
      parameterCode: faker.datatype.string(),
      parameterValueForFuel: optionalValue(faker.datatype.number()),
      calcParamValFuel: optionalValue(faker.datatype.number()),
      sampleTypeCode: optionalValue(faker.datatype.string()),
      operatingConditionCode: optionalValue(faker.datatype.string()),
      segmentNumber: optionalValue(faker.datatype.number()),
      userId: optionalValue(faker.datatype.string()),
      addDate: optionalValue(faker.date.soon()),
      updateDate: optionalValue(faker.date.soon()),
      parameterUnitsOfMeasureCode: optionalValue(faker.datatype.string()),
      calcAppeStatus: optionalValue(faker.datatype.string()),
      reportingPeriodId: faker.datatype.number(),
      monitoringLocationId: faker.datatype.string(),
      hrlyFuelFlow: new HrlyFuelFlow(),
      monitorFormula: genMonitorFormula<MonitorFormula>()[0],
      monitorSystem: new MonitorSystem(),
      monitorLocation: genMonitorLocation()[0],
    } as RepoType);
  }

  return hourlyParamFuelFlows;
};
