import { Nsps4tSummaryDTO } from '../dto/nsps4t-summary.dto';
import { Nsps4tSummaryWorkspaceRepository } from '../nsps4t-summary-workspace/nsps4t-summary-workspace.repository';
import { Nsps4tSummaryMap } from '../maps/nsps4t-summary.map';
import { Nsps4tSummaryRepository } from '../nsps4t-summary/nsps4t-summary.repository';
import { hasArrayValues } from '../utils/utils';

export type ExportNsps4tSummaryDataProperties = {
  monitoringLocationIds: string[];
  year: number;
  quarter: number;
  repository: Nsps4tSummaryRepository | Nsps4tSummaryWorkspaceRepository;
  nsps4tSummaryMap?: Nsps4tSummaryMap;
};

export const exportNsps4tSummaryQuery = async ({
  monitoringLocationIds,
  year,
  quarter,
  repository,
}: Omit<ExportNsps4tSummaryDataProperties, 'nsps4tSummaryMap'>) => {
  return repository
    .createQueryBuilder('nsps4tSummary')
    .innerJoinAndSelect('nsps4tSummary.monitorLocation', 'monitorLocation')
    .leftJoinAndSelect('monitorLocation.unit', 'unit')
    .leftJoinAndSelect('monitorLocation.stackPipe', 'stack')
    .innerJoin('nsps4tSummary.reportingPeriod', 'reportingPeriod')
    .where('monitorLocation.mon_loc_id IN (:...monitoringLocationIds)', {
      monitoringLocationIds,
    })
    .andWhere('reportingPeriod.year = :year', { year })
    .andWhere('reportingPeriod.quarter = :quarter', { quarter })
    .getMany();
};

export const exportNsps4tSummaryData = async ({
  monitoringLocationIds,
  year,
  quarter,
  repository,
  nsps4tSummaryMap = new Nsps4tSummaryMap(),
}: ExportNsps4tSummaryDataProperties): Promise<Nsps4tSummaryDTO[] | null> => {
  const nsps4tSummaryData = await exportNsps4tSummaryQuery({
    monitoringLocationIds,
    year,
    quarter,
    repository,
  });

  const mapped = await nsps4tSummaryMap.many(nsps4tSummaryData);

  if (hasArrayValues(mapped)) {
    return mapped;
  }

  return null;
};
