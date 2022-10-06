import { SamplingTrainRepository } from '../sampling-train/sampling-train.repository';
import { SamplingTrainMap } from '../maps/sampling-train.map';
import { hasArrayValues } from '../utils/utils';
import { SamplingTrainWorkspaceRepository } from '../sampling-train-workspace/sampling-train-workspace.repository';

type ExportSamplingTrainDataProperties = {
  sorbentTrapId: string;
  repository: SamplingTrainRepository | SamplingTrainWorkspaceRepository;
  samplingTrainMap?: SamplingTrainMap;
};

export const exportSamplingTrainQuery = async ({
  sorbentTrapId,
  repository,
}: Omit<ExportSamplingTrainDataProperties, 'samplingTrainMap'>) => {
  return repository
    .createQueryBuilder('sorbentTrap')
    .innerJoinAndSelect('sorbentTrap.component', 'component')
    .where('sorbentTrap.trap_id = :sorbentTrapId', { sorbentTrapId })
    .getMany();
};

export const exportSamplingTrainData = async ({
  sorbentTrapId,
  repository,
  samplingTrainMap = new SamplingTrainMap(),
}: ExportSamplingTrainDataProperties) => {
  const samplingTrainData = await exportSamplingTrainQuery({
    sorbentTrapId,
    repository,
  });

  const mapped = await samplingTrainMap.many(samplingTrainData);

  if (hasArrayValues(mapped)) {
    return mapped;
  }

  return null;
};
