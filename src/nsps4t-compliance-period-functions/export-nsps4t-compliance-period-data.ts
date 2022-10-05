import { Nsps4tCompliancePeriodRepository } from '../nsps4t-compliance-period/nsps4t-compliance-period.repository';
import { Nsps4tCompliancePeriodWorkspaceRepository } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.repository';
import { Nsps4tCompliancePeriodMap } from '../maps/nsps4t-compliance-period.map';
import { hasArrayValues } from '../utils/utils';

export type ExportNsps4tCompliancePeriodDataProperties = {
  nsps4tSummaryIds: string[];
  repository:
    | Nsps4tCompliancePeriodRepository
    | Nsps4tCompliancePeriodWorkspaceRepository;
  map?: Nsps4tCompliancePeriodMap;
};

export const exportNsps4tCompliancePeriodQuery = async ({
  nsps4tSummaryIds,
  repository,
}: Omit<ExportNsps4tCompliancePeriodDataProperties, 'map'>) => {
  return repository
    .createQueryBuilder('nsps4tCompliancePeriod')
    .where('nsps4tCompliancePeriod.nsps4t_sum_id IN (...nsps4tSummaryIds)', {
      nsps4tSummaryIds,
    })
    .getMany();
};

export const exportNps4tCompliancePeriodData = async ({
  nsps4tSummaryIds,
  repository,
  map = new Nsps4tCompliancePeriodMap(),
}: ExportNsps4tCompliancePeriodDataProperties) => {
  const nsps4tCompliancePeriodData = await exportNsps4tCompliancePeriodQuery({
    nsps4tSummaryIds,
    repository,
  });

  const mapped = await map.many(nsps4tCompliancePeriodData);

  if (hasArrayValues(mapped)) {
    return mapped;
  }

  return null;
};
