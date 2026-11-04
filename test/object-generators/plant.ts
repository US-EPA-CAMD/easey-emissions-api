import { faker } from '@faker-js/faker';
import { Unit } from '../../src/entities/unit.entity';
import { StackPipe } from '../../src/entities/stack-pipe.entity';
import { genMonitorPlan, GenMonitorPlanConfig } from './monitor-plan';
import { optionalValue } from './util';

type GenPlantConfig = {
  include?: Array<'units' | 'stackPipes' | 'monitorPlans'>;
  monitorPlanAmount?: number;
  monitorPlanConfig?: GenMonitorPlanConfig;
};

export const genPlant = <RepoType>(
  amount = 1,
  config?: GenPlantConfig,
): RepoType[] => {
  const plants: RepoType[] = [];

  for (let plant = 0; plant < amount; plant++) {
    plants.push(({
      id: faker.number.int(),
      orisCode: optionalValue(faker.number.int()),
      name: faker.string.sample(),
      state: faker.location.state({ abbreviated: true }),
      countyCode: optionalValue(faker.string.sample()),
      region: optionalValue(faker.number.int()),
      units: config?.include?.includes('units') ? [new Unit()] : undefined,
      stackPipes: config?.include?.includes('stackPipes')
        ? [new StackPipe()]
        : undefined,
      monitorPlans: config?.include?.includes('monitorPlans')
        ? genMonitorPlan(config?.monitorPlanAmount, config?.monitorPlanConfig)
        : undefined,
    } as unknown) as RepoType);
  }

  return plants;
};
