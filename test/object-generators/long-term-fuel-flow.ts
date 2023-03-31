import { faker } from '@faker-js/faker';
import { optionalValue } from './util';

export const genLongTermFuelFlow = <RepoType>(amount = 1): RepoType[] => {
  const longTermFuelFlow: RepoType[] = [];

  let unitId = null;
  let stackPipeId = null;
  if (faker.datatype.boolean()) unitId = faker.datatype.string();
  else stackPipeId = faker.datatype.string();

  for (
    let longTermFuelFlowCount = 0;
    longTermFuelFlowCount < amount;
    longTermFuelFlowCount++
  ) {
    longTermFuelFlow.push(({
      stackPipeId,
      unitId,
      monitoringSystemId: faker.datatype.string(),
      fuelFlowPeriodCode: optionalValue(faker.datatype.string()),
      longTermFuelFlowValue: faker.datatype.number(),
      longTermFuelFlowUomCode: faker.datatype.string(),
      grossCalorificValue: optionalValue(faker.datatype.number()),
      gcvUnitsOfMeasureCode: optionalValue(faker.datatype.string()),
      totalHeatInput: optionalValue(faker.datatype.number()),
      id: faker.datatype.string(),
      reportingPeriodId: faker.datatype.number(),
      monitoringLocationId: faker.datatype.string(),
      calcTotalHeatInput: faker.datatype.number(),
      userId: faker.datatype.string(),
      addDate: faker.datatype.datetime(),
      updateDate: faker.datatype.datetime(),
    } as unknown) as RepoType);
  }
  return longTermFuelFlow;
};
