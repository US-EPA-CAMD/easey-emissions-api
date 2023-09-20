import { faker } from '@faker-js/faker';
import { optionalValue } from './util';
import { Component } from '../../src/entities/component.entity';
import { genMonitorLocation } from './monitor-location';
import { genReportingPeriod } from './reporting-period';
import { MonitorLocation } from '../../src/entities/monitor-location.entity';
import { genSorbentTrap } from './sorbent-trap';

type GenSamplingTrainConfig = {
  include?: Array<
    'component' | 'monitorLocation' | 'reportingPeriod' | 'sorbentTrap'
  >;
};

export const genSamplingTrain = <RepoType>(
  amount = 1,
  config?: GenSamplingTrainConfig,
) => {
  const samplingTrains: RepoType[] = [];

  for (let samplingTrain = 0; samplingTrain < amount; samplingTrain++) {
    samplingTrains.push({
      id: faker.datatype.string(),
      sorbentTrapId: faker.datatype.string(),
      monitoringLocationId: faker.datatype.string(),
      reportingPeriodId: faker.datatype.number(),
      componentId: optionalValue(faker.datatype.string()),
      sorbentTrapSN: faker.datatype.string(),
      mainTrapHg: optionalValue(faker.datatype.string()),
      btTrapHg: optionalValue(faker.datatype.string()),
      spikeTrapHg: optionalValue(faker.datatype.string()),
      spikeReferenceValue: optionalValue(faker.datatype.string()),
      totalSampleVolumeDSCM: optionalValue(faker.datatype.number()),
      referenceSFSRRatio: optionalValue(faker.datatype.number()),
      hgConcentration: optionalValue(faker.datatype.string()),
      percentBreakthrough: optionalValue(faker.datatype.number()),
      percentSpikeRecovery: optionalValue(faker.datatype.number()),
      samplingRatioCheckResultCode: optionalValue(faker.datatype.string()),
      postLeakCheckResultCode: optionalValue(faker.datatype.string()),
      trainQAStatusCode: optionalValue(faker.datatype.string()),
      sampleDamageExplanation: optionalValue(faker.datatype.string()),
      calcHgConcentration: optionalValue(faker.datatype.string()),
      calcPercentBreakthrough: optionalValue(faker.datatype.number()),
      calcPercentSpikeRecovery: optionalValue(faker.datatype.number()),
      userId: optionalValue(faker.datatype.string()),
      addDate: optionalValue(faker.date.soon()),
      updateDate: optionalValue(faker.date.soon()),
      component: config?.include.includes('component')
        ? new Component()
        : undefined,
      monitorLocation: config?.include.includes('monitorLocation')
        ? genMonitorLocation<MonitorLocation>()[0]
        : undefined,
      reportingPeriod: config?.include.includes('reportingPeriod')
        ? genReportingPeriod()[0]
        : undefined,
      sorbentTrap: config?.include.includes('sorbentTrap')
        ? genSorbentTrap()[0]
        : undefined,
    } as RepoType);
  }

  return samplingTrains;
};
