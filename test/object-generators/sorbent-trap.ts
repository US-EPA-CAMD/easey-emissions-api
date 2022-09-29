import { MonitorLocation } from '../../src/entities/monitor-location.entity';
import { MonitorSystem } from '../../src/entities/monitor-system.entity';
import { faker } from '@faker-js/faker';
import { genMonitorLocation } from './monitor-location';
import { genReportingPeriod } from './reporting-period';
import { genSamplingTrain } from './sampling-train';

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
      pairedTrapAgreement: faker.datatype.number(),
      absoluteDifferenceIndicator: faker.datatype.number(),
      modcCode: faker.datatype.string(),
      hgSystemConcentration: faker.datatype.string(),
      calcPairedTrapAgreement: faker.datatype.number(),
      calcModcCode: faker.datatype.string(),
      calcHgConcentration: faker.datatype.string(),
      userId: faker.datatype.string(),
      addDate: faker.date.soon(),
      updateDate: faker.date.soon(),
      apsCode: faker.datatype.string(),
      rataIndicator: faker.datatype.number(),
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
