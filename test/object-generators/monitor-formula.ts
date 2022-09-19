import { faker } from '@faker-js/faker';
import { optionalValue } from './util';
import { DerivedHrlyValue } from '../../src/entities/derived-hrly-value.entity';
import { MatsDerivedHrlyValue } from '../../src/entities/mats-derived-hrly-value.entity';
import { HrlyParamFuelFlow } from '../../src/entities/hrly-param-fuel-flow.entity';

type GenMonitorFormulaConfig = {
  include?: Array<
    'derivedHrlyValues' | 'matsDerivedHrlyValues' | 'hrlyParamFuelFlows'
  >;
};

export const genMonitorFormula = <RepoType>(
  amount = 1,
  config?: GenMonitorFormulaConfig,
): RepoType[] => {
  const formulae: RepoType[] = [];

  for (let formula = 0; formula < amount; formula++) {
    formulae.push({
      id: faker.datatype.string(45),
      monitoringLocationId: faker.datatype.string(7),
      parameterCode: faker.datatype.string(7),
      formulaCode: optionalValue(faker.datatype.string(7)),
      formulaId: faker.datatype.string(3),
      beginDate: optionalValue(faker.date.soon()),
      beginHour: optionalValue(faker.datatype.number()),
      endDate: optionalValue(faker.date.soon()),
      endHour: optionalValue(faker.datatype.number()),
      formulaText: optionalValue(faker.datatype.string(200)),
      userId: optionalValue(faker.datatype.string(25)),
      addDate: optionalValue(faker.date.soon()),
      updateDate: optionalValue(faker.date.soon()),
      derivedHrlyValues: config?.include.includes('derivedHrlyValues')
        ? [new DerivedHrlyValue()]
        : undefined,
      matsDerivedHrlyValues: config?.include.includes('matsDerivedHrlyValues')
        ? [new MatsDerivedHrlyValue()]
        : undefined,
      hrlyParamFuelFlows: config?.include.includes('hrlyParamFuelFlows')
        ? [new HrlyParamFuelFlow()]
        : undefined,
    } as RepoType);
  }

  return formulae;
};
