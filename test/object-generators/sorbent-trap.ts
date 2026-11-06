import { MonitorLocation } from '../../src/entities/monitor-location.entity';
import { MonitorSystem } from '../../src/entities/monitor-system.entity';
import { faker } from '@faker-js/faker';
import { genMonitorLocation } from './monitor-location';
import { genReportingPeriod } from './reporting-period';
import { genSamplingTrain } from './sampling-train';
import { optionalValue } from './util';

type GenSorbentTrapConfig = {
  include?: Array<
    'monitorLocation' | 'monitorSystem' | 'reportingPeriod' | 'samplingTrains'
  >;
  samplingTrainAmount?: number;
};

export const genSorbentTrap = <RepoType>(
  amount = 1,
  config?: GenSorbentTrapConfig,
) => {
  const sorbentTraps: RepoType[] = [];

  for (let sorbentTrap = 0; sorbentTrap < amount; sorbentTrap++) {
    sorbentTraps.push({
      id: faker.string.sample(),
      monitoringLocationId: faker.string.sample(),
      reportingPeriodId: faker.number.int(),
      beginDate: faker.date.soon(),
      beginHour: faker.number.int(),
      endDate: faker.date.soon(),
      endHour: faker.number.int(),
      monitoringSystemId: faker.string.sample(),
      pairedTrapAgreement: optionalValue(faker.number.int()),
      absoluteDifferenceIndicator: optionalValue(faker.number.int()),
      modcCode: optionalValue(faker.string.sample()),
      hgSystemConcentration: optionalValue(faker.string.sample()),
      calcPairedTrapAgreement: optionalValue(faker.number.int()),
      calcModcCode: optionalValue(faker.string.sample()),
      calcHgConcentration: optionalValue(faker.string.sample()),
      userId: optionalValue(faker.string.sample()),
      addDate: optionalValue(faker.date.soon()),
      updateDate: optionalValue(faker.date.soon()),
      apsCode: optionalValue(faker.string.sample()),
      rataIndicator: optionalValue(faker.number.int()),
      monitorLocation: config?.include.includes('monitorLocation')
        ? genMonitorLocation<MonitorLocation>()[0]
        : undefined,
      monitorSystem: config?.include.includes('monitorSystem')
        ? new MonitorSystem()
        : undefined,
      reportingPeriod: config?.include.includes('reportingPeriod')
        ? genReportingPeriod()[0]
        : undefined,
      samplingTrains: config?.include.includes('samplingTrains')
        ? genSamplingTrain(config?.samplingTrainAmount)
        : undefined,
    } as RepoType);
  }

  return sorbentTraps;
};
