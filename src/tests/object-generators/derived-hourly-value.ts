import { DerivedHrlyValue } from '../../entities/derived-hrly-value.entity';
import { faker } from '@faker-js/faker';
import { HrlyOpData } from '../../entities/hrly-op-data.entity';
import { MonitorSystem } from '../../entities/monitor-system.entity';
import { MonitorFormula } from '../../entities/monitor-formula.entity';

type GenDerivedHrlyValueConfig = {
  include?: Array<'hrlyOpData' | 'monitorSystem' | 'monitorFormula'>;
};

export const genDerivedHrlyValues = (
  amount = 1,
  config?: GenDerivedHrlyValueConfig,
): DerivedHrlyValue[] => {
  const hourlyValues: DerivedHrlyValue[] = [];
  for (let hourlyValue = 0; hourlyValue < amount; hourlyValue++) {
    hourlyValues.push({
      id: faker.datatype.string(45),
      hourId: faker.datatype.string(45),
      monSysId: faker.datatype.string(45),
      monFormId: faker.datatype.string(45),
      parameterCode: faker.datatype.string(7),
      unadjustedHrlyValue: faker.datatype.number({ precision: 3 }),
      applicableBiasAdjFactor: faker.datatype.number({ precision: 3 }),
      calcUnadjustedHrlyValue: faker.datatype.number({ precision: 3 }),
      adjustedHrlyValue: faker.datatype.number({ precision: 4 }),
      calcAdjustedHrlyValue: faker.datatype.number({ precision: 4 }),
      operatingConditionCode: faker.datatype.string(7),
      pctAvailable: faker.datatype.number({ precision: 4 }),
      diluentCapInd: faker.datatype.number({ precision: 0 }),
      segmentNum: faker.datatype.number({ precision: 0 }),
      fuelCode: faker.datatype.string(7),
      userId: faker.datatype.string(25),
      addDate: faker.datatype.datetime(),
      updateDate: faker.datatype.datetime(),
      calcPctDiluent: faker.datatype.string(10),
      calcPctMoisture: faker.datatype.string(10),
      calcRataStatus: faker.datatype.string(75),
      calcAppeStatus: faker.datatype.string(75),
      rptPeriodId: faker.datatype.number({ precision: 0 }),
      monitorLocationId: faker.datatype.string(45),
      calcFuelFlowTotal: faker.datatype.number({ precision: 4 }),
      calcHourMeasureCode: faker.datatype.string(7),
      // Replace new Model() with genModel as created/needed
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
    } as DerivedHrlyValue);
  }
  return hourlyValues;
};
