import { faker } from '@faker-js/faker';
import { optionalValue } from './util';

export const genLongTermFuelFlow = <RepoType>(amount = 1): RepoType[] => {
  const longTermFuelFlow: RepoType[] = [];

  let unitId = null;
  let stackPipeId = null;
  if (faker.datatype.boolean()) unitId = faker.string.sample();
  else stackPipeId = faker.string.sample();

  for (
    let longTermFuelFlowCount = 0;
    longTermFuelFlowCount < amount;
    longTermFuelFlowCount++
  ) {
    longTermFuelFlow.push(({
      stackPipeId,
      unitId,
      monitoringSystemId: faker.string.sample(),
      fuelFlowPeriodCode: optionalValue(faker.string.sample()),
      longTermFuelFlowValue: faker.number.int(),
      longTermFuelFlowUomCode: faker.string.sample(),
      grossCalorificValue: optionalValue(faker.number.int()),
      gcvUnitsOfMeasureCode: optionalValue(faker.string.sample()),
      totalHeatInput: optionalValue(faker.number.int()),
      id: faker.string.sample(),
      reportingPeriodId: faker.number.int(),
      monitoringLocationId: faker.string.sample(),
      calcTotalHeatInput: faker.number.int(),
      userId: faker.string.sample(),
      addDate: faker.date.anytime(),
      updateDate: faker.date.anytime(),
    } as unknown) as RepoType);
  }
  return longTermFuelFlow;
};
