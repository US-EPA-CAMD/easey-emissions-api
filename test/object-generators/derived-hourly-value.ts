import { faker } from '@faker-js/faker';
import { HrlyOpData } from '../../src/entities/hrly-op-data.entity';
import { MonitorSystem } from '../../src/entities/monitor-system.entity';
import { MonitorFormula } from '../../src/entities/monitor-formula.entity';
import { optionalValue } from './util';
import { DerivedHourlyValueParamsDto } from '../../src/dto/derived-hourly-value-params.dto';

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
      monSysId: optionalValue(faker.datatype.string(45)),
      monFormId: optionalValue(faker.datatype.string(45)),
      parameterCode: faker.datatype.string(7),
      unadjustedHrlyValue: optionalValue(
        faker.datatype.float({ precision: 0.001 }),
      ),
      applicableBiasAdjFactor: optionalValue(
        faker.datatype.float({ precision: 0.001 }),
      ),
      calcUnadjustedHrlyValue: optionalValue(
        faker.datatype.float({ precision: 0.001 }),
      ),
      adjustedHrlyValue: optionalValue(
        faker.datatype.float({ precision: 0.0001 }),
      ),
      calcAdjustedHrlyValue: optionalValue(
        faker.datatype.float({ precision: 0.0001 }),
      ),
      operatingConditionCode: optionalValue(faker.datatype.string(7)),
      pctAvailable: optionalValue(faker.datatype.float({ precision: 0.0001 })),
      diluentCapInd: optionalValue(faker.datatype.number()),
      segmentNum: optionalValue(faker.datatype.number()),
      fuelCode: optionalValue(faker.datatype.string(7)),
      userId: optionalValue(faker.datatype.string(25)),
      addDate: optionalValue(faker.datatype.datetime()),
      updateDate: optionalValue(faker.datatype.datetime()),
      calcPctDiluent: optionalValue(faker.datatype.string(10)),
      calcPctMoisture: optionalValue(faker.datatype.string(10)),
      calcRataStatus: optionalValue(faker.datatype.string(75)),
      calcAppeStatus: optionalValue(faker.datatype.string(75)),
      rptPeriodId: faker.datatype.number(),
      monitorLocationId: faker.datatype.string(45),
      calcFuelFlowTotal: optionalValue(
        faker.datatype.float({ precision: 0.0001 }),
      ),
      calcHourMeasureCode: optionalValue(faker.datatype.string(7)),
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

export const genDerivedHourlyValueParamsDto = (
  amount = 1,
): DerivedHourlyValueParamsDto[] => {
  const dtos: DerivedHourlyValueParamsDto[] = [];

  const orisCode = () => {
    return faker.datatype.string(6);
  };

  for (let i = 0; i < amount; i++) {
    dtos.push({
      beginDate: (faker.date.soon().toISOString() as unknown) as Date,
      endDate: (faker.date.soon().toISOString() as unknown) as Date,
      locationName: optionalValue(
        (faker.helpers
          .uniqueArray(faker.datatype.string, 3)
          .join('|') as unknown) as string[],
      ),
      orisCode: optionalValue(
        (faker.helpers
          .uniqueArray(orisCode, 3)
          .join('|') as unknown) as number[],
      ),
    });
  }

  return dtos;
};
