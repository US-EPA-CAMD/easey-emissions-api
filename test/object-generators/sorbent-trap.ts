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
      id: faker.datatype.string(),
      monitoringLocationId: faker.datatype.string(),
      reportingPeriodId: faker.datatype.number(),
      beginDate: faker.date.soon(),
      beginHour: faker.datatype.number(),
      endDate: faker.date.soon(),
      endHour: faker.datatype.number(),
      monitoringSystemId: faker.datatype.string(),
      pairedTrapAgreement: optionalValue(faker.datatype.number()),
      absoluteDifferenceIndicator: optionalValue(faker.datatype.number()),
      modcCode: optionalValue(faker.datatype.string()),
      hgSystemConcentration: optionalValue(faker.datatype.string()),
      calcPairedTrapAgreement: optionalValue(faker.datatype.number()),
      calcModcCode: optionalValue(faker.datatype.string()),
      calcHgConcentration: optionalValue(faker.datatype.string()),
      userId: optionalValue(faker.datatype.string()),
      addDate: optionalValue(faker.date.soon()),
      updateDate: optionalValue(faker.date.soon()),
      apsCode: optionalValue(faker.datatype.string()),
      rataIndicator: optionalValue(faker.datatype.number()),
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
