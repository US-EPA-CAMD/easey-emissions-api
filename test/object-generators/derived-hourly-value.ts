import { faker } from '@faker-js/faker';
import { HrlyOpData } from '../../src/entities/hrly-op-data.entity';
import { MonitorSystem } from '../../src/entities/monitor-system.entity';
import { MonitorFormula } from '../../src/entities/monitor-formula.entity';
import { optionalValue } from './util';

type GenDerivedHrlyValueConfig = {
  include?: Array<'hrlyOpData' | 'monitorSystem' | 'monitorFormula'>;
};

// Using RepoType for workspace/non-workspace
export const genDerivedHrlyValues = <RepoType>(
  amount = 1,
  config?: GenDerivedHrlyValueConfig,
): RepoType[] => {
  const hourlyValues: RepoType[] = [];
  for (let hourlyValue = 0; hourlyValue < amount; hourlyValue++) {
    hourlyValues.push(({
      id: faker.string.sample(45),
      hourId: faker.string.sample(45),
      monSysId: optionalValue(faker.string.sample(45)),
      monFormId: optionalValue(faker.string.sample(45)),
      parameterCode: faker.string.sample(7),
      unadjustedHrlyValue: optionalValue(
        faker.number.float({ multipleOf: 0.001 }),
      ),
      applicableBiasAdjFactor: optionalValue(
        faker.number.float({ multipleOf: 0.001 }),
      ),
      calcUnadjustedHrlyValue: optionalValue(
        faker.number.float({ multipleOf: 0.001 }),
      ),
      adjustedHrlyValue: optionalValue(
        faker.number.float({ multipleOf: 0.0001 }),
      ),
      calcAdjustedHrlyValue: optionalValue(
        faker.number.float({ multipleOf: 0.0001 }),
      ),
      operatingConditionCode: optionalValue(faker.string.sample(7)),
      pctAvailable: optionalValue(faker.number.float({ multipleOf: 0.0001 })),
      diluentCapInd: optionalValue(faker.number.int()),
      segmentNum: optionalValue(faker.number.int()),
      fuelCode: optionalValue(faker.string.sample(7)),
      userId: optionalValue(faker.string.sample(25)),
      addDate: optionalValue(faker.date.anytime()),
      updateDate: optionalValue(faker.date.anytime()),
      calcPctDiluent: optionalValue(faker.string.sample(10)),
      calcPctMoisture: optionalValue(faker.string.sample(10)),
      calcRataStatus: optionalValue(faker.string.sample(75)),
      calcAppeStatus: optionalValue(faker.string.sample(75)),
      rptPeriodId: faker.number.int(),
      monitorLocationId: faker.string.sample(45),
      calcFuelFlowTotal: optionalValue(
        faker.number.float({ multipleOf: 0.0001 }),
      ),
      calcHourMeasureCode: optionalValue(faker.string.sample(7)),
      // Replace new Model() with genModel(1) as created/needed
      hrlyOpData:
        config?.include?.includes('hrlyOpData') === true
          ? new HrlyOpData()
          : undefined,
      monitorSystem:
        config?.include?.includes('monitorSystem') === true
          ? new MonitorSystem()
          : undefined,
      monitorFormula:
        config?.include?.includes('monitorFormula') === true
          ? new MonitorFormula()
          : undefined,
    } as unknown) as RepoType);
  }
  return hourlyValues;
};
