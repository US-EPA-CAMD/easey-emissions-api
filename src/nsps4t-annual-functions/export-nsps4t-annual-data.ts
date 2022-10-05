import { hasArrayValues } from '../utils/utils';
import { Nsps4tAnnualRepository } from '../nsps4t-annual/nsps4t-annual.repository';
import { Nsps4tAnnualWorkspaceRepository } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.repository';
import { Nsps4tAnnualMap } from '../maps/nsps4t-annual.map';

export type ExportNsps4tAnnualDataProperties = {
  nsps4tSummaryIds: string[];
  repository: Nsps4tAnnualRepository | Nsps4tAnnualWorkspaceRepository;
  map?: Nsps4tAnnualMap;
};

export const exportNsps4tAnnualQuery = async ({
  nsps4tSummaryIds,
  repository,
}: Omit<ExportNsps4tAnnualDataProperties, 'map'>) => {
  return repository
    .createQueryBuilder('nsps4tAnnual')
    .where('nsps4tAnnual.nsps4t_sum_id IN (:...nsps4tSummaryIds)', {
      nsps4tSummaryIds,
    })
    .getMany();
};

export const exportNsps4tAnnualData = async ({
  nsps4tSummaryIds,
  repository,
  map = new Nsps4tAnnualMap(),
}: ExportNsps4tAnnualDataProperties) => {
  const nsps4tAnnualData = await exportNsps4tAnnualQuery({
    nsps4tSummaryIds,
    repository,
  });

  const mapped = await map.many(nsps4tAnnualData);

  if (hasArrayValues(mapped)) {
    return mapped;
  }

  return null;
};
