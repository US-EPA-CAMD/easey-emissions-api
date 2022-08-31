import { faker } from '@faker-js/faker';
import { HrlyOpData } from '../../src/entities/hrly-op-data.entity';
import { MonitorSystem } from '../../src/entities/monitor-system.entity';
import { MonitorFormula } from '../../src/entities/monitor-formula.entity';

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
      id: faker.datatype.string(45),
      hourId: faker.datatype.string(45),
      monSysId: faker.datatype.string(45),
      monFormId: faker.datatype.string(45),
      parameterCode: faker.datatype.string(7),
      unadjustedHrlyValue: faker.datatype.float({ precision: 0.001 }),
      applicableBiasAdjFactor: faker.datatype.float({ precision: 0.001 }),
      calcUnadjustedHrlyValue: faker.datatype.float({ precision: 0.001 }),
      adjustedHrlyValue: faker.datatype.float({ precision: 0.0001 }),
      calcAdjustedHrlyValue: faker.datatype.float({ precision: 0.0001 }),
      operatingConditionCode: faker.datatype.string(7),
      pctAvailable: faker.datatype.float({ precision: 0.0001 }),
      diluentCapInd: faker.datatype.number(),
      segmentNum: faker.datatype.number(),
      fuelCode: faker.datatype.string(7),
      userId: faker.datatype.string(25),
      addDate: faker.datatype.datetime(),
      updateDate: faker.datatype.datetime(),
      calcPctDiluent: faker.datatype.string(10),
      calcPctMoisture: faker.datatype.string(10),
      calcRataStatus: faker.datatype.string(75),
      calcAppeStatus: faker.datatype.string(75),
      rptPeriodId: faker.datatype.number(),
      monitorLocationId: faker.datatype.string(45),
      calcFuelFlowTotal: faker.datatype.float({ precision: 0.0001 }),
      calcHourMeasureCode: faker.datatype.string(7),
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
