import { SamplingTrainMap } from './sampling-train.map';
import { genSamplingTrain } from '../../test/object-generators/sampling-train';
import { SamplingTrain } from '../entities/sampling-train.entity';
import { faker } from '@faker-js/faker';

describe('SamplingTrainMap', () => {
  let map: SamplingTrainMap;

  beforeAll(() => {
    map = new SamplingTrainMap();
  });

  it('should map values correctly', async function() {
    const mocks = [
      genSamplingTrain<SamplingTrain>(1)[0],
      genSamplingTrain<SamplingTrain>(1, {
        include: ['monitorLocation'],
      })[0],
      genSamplingTrain<SamplingTrain>(1, {
        include: ['reportingPeriod'],
      })[0],
      genSamplingTrain<SamplingTrain>(1, {
        include: ['component'],
      })[0],
    ];

    mocks[3].component.componentId = faker.datatype.string();

    const expectOne = async (mock: SamplingTrain) => {
      await expect(map.one(mock)).resolves.toEqual({
        id: mock.id,
        componentId: mock.component?.componentId ?? null,
        componentRecordId: mock.componentId,
        sorbentTrapId: mock.sorbentTrapId,
        monitoringLocationId: mock.monitoringLocationId,
        reportingPeriodId: mock.reportingPeriodId,
        userId: mock.userId,
        addDate: mock.addDate,
        updateDate: mock.updateDate,
        sorbentTrapSn: mock.sorbentTrapSn,
        mainTrapHg: mock.mainTrapHg,
        btTrapHg: mock.btTrapHg,
        spikeTrapHg: mock.spikeTrapHg,
        spikeReferenceValue: mock.spikeReferenceValue,
        totalSampleVolumeDscm: mock.totalSampleVolumeDscm,
        referenceSfsrRatio: mock.referenceSfsrRatio,
        hgConcentration: mock.hgConcentration,
        percentBreakthrough: mock.percentBreakthrough,
        percentSpikeRecovery: mock.percentSpikeRecovery,
        samplingRatioCheckResultCode: mock.samplingRatioCheckResultCode,
        postLeakCheckResultCode: mock.postLeakCheckResultCode,
        trainQaStatusCode: mock.trainQaStatusCode,
        sampleDamageExplanation: mock.sampleDamageExplanation,
        calcHgConcentration: mock.calcHgConcentration,
        calcPercentBreakthrough: mock.calcPercentBreakthrough,
        calcPercentSpikeRecovery: mock.calcPercentSpikeRecovery,
      });
    };

    await Promise.all(
      mocks.map(mock => {
        return expectOne(mock);
      }),
    );
  });
});
