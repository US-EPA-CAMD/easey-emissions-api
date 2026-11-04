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
      id: faker.string.sample(),
      sorbentTrapId: faker.string.sample(),
      monitoringLocationId: faker.string.sample(),
      reportingPeriodId: faker.number.int(),
      componentId: optionalValue(faker.string.sample()),
      sorbentTrapSN: faker.string.sample(),
      mainTrapHg: optionalValue(faker.string.sample()),
      btTrapHg: optionalValue(faker.string.sample()),
      spikeTrapHg: optionalValue(faker.string.sample()),
      spikeReferenceValue: optionalValue(faker.string.sample()),
      totalSampleVolumeDSCM: optionalValue(faker.number.int()),
      referenceSFSRRatio: optionalValue(faker.number.int()),
      hgConcentration: optionalValue(faker.string.sample()),
      percentBreakthrough: optionalValue(faker.number.int()),
      percentSpikeRecovery: optionalValue(faker.number.int()),
      samplingRatioCheckResultCode: optionalValue(faker.string.sample()),
      postLeakCheckResultCode: optionalValue(faker.string.sample()),
      trainQAStatusCode: optionalValue(faker.string.sample()),
      sampleDamageExplanation: optionalValue(faker.string.sample()),
      calcHgConcentration: optionalValue(faker.string.sample()),
      calcPercentBreakthrough: optionalValue(faker.number.int()),
      calcPercentSpikeRecovery: optionalValue(faker.number.int()),
      userId: optionalValue(faker.string.sample()),
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
