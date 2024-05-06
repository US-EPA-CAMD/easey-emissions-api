import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { SamplingTrainImportDTO } from '../dto/sampling-train.dto';
import { randomUUID } from 'crypto';
import { SamplingTrainWorkspaceRepository } from '../sampling-train-workspace/sampling-train-workspace.repository';

export type SamplingTrainWorkspaceCreate = SamplingTrainImportDTO & {
  sorbentTrapId: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  identifiers: ImportIdentifiers;
};

type ImportSamplingTrainData = {
  data: SamplingTrainWorkspaceCreate;
  repository: SamplingTrainWorkspaceRepository;
};

export const importSamplingTrainData = async ({
  data,
  repository,
}: ImportSamplingTrainData) => {
  return repository.save(
    repository.create({
      id: randomUUID(),
      sorbentTrapId: data.sorbentTrapId,
      monitoringLocationId: data.monitoringLocationId,
      reportingPeriodId: data.reportingPeriodId,
      componentId: data.identifiers?.locations[data.monitoringLocationId]?.components?.[data.componentId],
      sorbentTrapSn: data.sorbentTrapSN,
      mainTrapHg: data.mainTrapHg,
      btTrapHg: data.btTrapHg,
      spikeTrapHg: data.spikeTrapHg,
      spikeReferenceValue: data.spikeReferenceValue,
      totalSampleVolumeDscm: data.totalSampleVolumeDSCM,
      referenceSfsrRatio: data.referenceSFSRRatio,
      hgConcentration: data.hgConcentration,
      percentBreakthrough: data.percentBreakthrough,
      percentSpikeRecovery: data.percentSpikeRecovery,
      samplingRatioCheckResultCode: data.samplingRatioCheckResultCode,
      postLeakCheckResultCode: data.postLeakCheckResultCode,
      trainQAStatusCode: data.trainQAStatusCode,
      sampleDamageExplanation: data.sampleDamageExplanation,
      userId: data.identifiers?.userId,
      addDate: new Date(),
      updateDate: new Date(),
    }),
  );
};
