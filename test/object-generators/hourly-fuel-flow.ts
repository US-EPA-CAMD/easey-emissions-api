import { faker } from '@faker-js/faker';
import { optionalValue } from './util';
import { HrlyFuelFlow } from '../../src/entities/hrly-fuel-flow.entity';
import { MonitorSystem } from '../../src/entities/monitor-system.entity';
import { HrlyParamFuelFlow } from '../../src/entities/workspace/hrly-param-fuel-flow.entity';

export const genHourlyFuelFlow = <RepoType>(amount = 1): RepoType[] => {
  const hourlyFuelFlows: RepoType[] = [];

  for (let param = 0; param < amount; param++) {
    hourlyFuelFlows.push(({
      id: faker.datatype.string(),
      hourlyId: faker.datatype.string(),
      monitoringSystemId: optionalValue(faker.datatype.string()),
      fuelCode: optionalValue(faker.datatype.string()),
      fuelUsageTime: optionalValue(faker.datatype.number()),
      volumetricFlowRate: optionalValue(faker.datatype.number()),
      massFlowRate: optionalValue(faker.datatype.number()),
      calcMassFlowRate: optionalValue(faker.datatype.number()),
      sourceOfDataMassCode: optionalValue(faker.datatype.string()),
      userId: optionalValue(faker.datatype.string()),
      addDate: optionalValue(faker.date.soon()),
      updateDate: optionalValue(faker.date.soon()),
      volumetricUnitsOfMeasureCode: optionalValue(faker.datatype.string()),
      calcVolumetricFlowRate: optionalValue(faker.datatype.number()),
      calcAppdStatus: optionalValue(faker.datatype.string()),
      reportingPeriodId: faker.datatype.number(),
      monitoringLocationId: faker.datatype.string(),
      monitorSystem: new MonitorSystem(),
      hrlyOpData: new HrlyFuelFlow(),
      hrlyParamFuelFlows: new HrlyParamFuelFlow(),
    } as unknown)as RepoType);
  }

  return hourlyFuelFlows;
};
