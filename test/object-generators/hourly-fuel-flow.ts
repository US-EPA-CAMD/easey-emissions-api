import { faker } from '@faker-js/faker';
import { optionalValue } from './util';
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
    hourlyFuelFlows.push(({
      id: faker.string.sample(),
      hourId: faker.string.sample(),
      monitoringSystemId: optionalValue(faker.string.sample()),
      fuelCode: optionalValue(faker.string.sample()),
      fuelUsageTime: optionalValue(faker.number.int()),
      volumetricFlowRate: optionalValue(faker.number.int()),
      massFlowRate: optionalValue(faker.number.int()),
      calcMassFlowRate: optionalValue(faker.number.int()),
      sourceOfDataMassCode: optionalValue(faker.string.sample()),
      userId: optionalValue(faker.string.sample()),
      addDate: optionalValue(faker.date.soon()),
      updateDate: optionalValue(faker.date.soon()),
      volumetricUnitsOfMeasureCode: optionalValue(faker.string.sample()),
      calcVolumetricFlowRate: optionalValue(faker.number.int()),
      calcAppdStatus: optionalValue(faker.string.sample()),
      reportingPeriodId: faker.number.int(),
      monitoringLocationId: faker.string.sample(),
      monitorSystem: config?.include.includes('monitorSystem')
        ? new MonitorSystem()
        : undefined,
      hrlyOpData: config?.include.includes('hrlyOpData')
        ? genHourlyOpValues()[0]
        : undefined,
      hrlyParamFuelFlows: config?.include.includes('hrlyParamFuelFlows')
        ? genHourlyFuelFlow(config?.hrlyParamFuelFlowsAmount)
        : undefined,
    } as unknown) as RepoType);
  }

  return hourlyFuelFlows;
};
