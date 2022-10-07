import { faker } from '@faker-js/faker';
import { optionalValue } from './util';
import { HrlyFuelFlow } from '../../src/entities/hrly-fuel-flow.entity';
import { MonitorSystem } from '../../src/entities/monitor-system.entity';
import { genHourlyOpValues } from './hourly-op-data-values';

type GenHourlyFuelFlowConfig = {
  include?: Array<'monitorSystem' | 'hrlyOpData' | 'hrlyParamFuelFlows'>;
  hrlyParamFuelFlowsAmount?: number;
};

export const genHourlyFuelFlow = <RepoType>(
  amount = 1,
  config?: GenHourlyFuelFlowConfig,
): RepoType[] => {
  const hourlyFuelFlows: RepoType[] = [];

  for (let param = 0; param < amount; param++) {
    hourlyFuelFlows.push({
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
      monitorSystem: config?.include.includes('monitorSystem')
        ? new MonitorSystem()
        : undefined,
      hrlyOpData: config?.include.includes('hrlyOpData')
        ? genHourlyOpValues()[0]
        : undefined,
      hrlyParamFuelFlows: config?.include.includes('hrlyParamFuelFlows')
        ? genHourlyFuelFlow(config?.hrlyParamFuelFlowsAmount)
        : undefined,
    } as unknown as RepoType);
  }

  return hourlyFuelFlows;
};
