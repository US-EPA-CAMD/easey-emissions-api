import { faker } from '@faker-js/faker';
import { Unit } from '../../src/entities/unit.entity';
import { StackPipe } from '../../src/entities/stack-pipe.entity';
import { genMonitorPlan, GenMonitorPlanConfig } from './monitor-plan';

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
      id: faker.datatype.number(),
      orisCode: faker.datatype.number(),
      name: faker.datatype.string(),
      state: faker.address.stateAbbr(),
      countyCode: faker.datatype.string(),
      region: faker.datatype.number(),
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
