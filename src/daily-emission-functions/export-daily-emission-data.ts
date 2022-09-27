import { DailyEmissionRepository } from '../daily-emission/daily-emission.repository';
import { DailyEmissionWorkspaceRepository } from '../daily-emission-workspace/daily-emission-workspace.repository';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DailyEmissionDTO } from '../dto/daily-emission.dto';

type ExportDailyEmissionDataProperties = {
  monitoringLocationIds: string[];
  year: number;
  quarter: number;
  repository: DailyEmissionRepository | DailyEmissionWorkspaceRepository;
  dailyEmissionMap?: DailyEmissionMap;
};

export const exportDailyEmissionData = async ({
  monitoringLocationIds,
  year,
  quarter,
  repository,
  dailyEmissionMap = new DailyEmissionMap(),
}: ExportDailyEmissionDataProperties): Promise<DailyEmissionDTO[]> => {
  const dailyEmissionDataQuery = await repository
    .createQueryBuilder('dailyEmission')
    .distinct(true)
    .leftJoinAndSelect('dailyEmission.monitorLocation', 'monitorLocation')
    .leftJoin('dailyEmission.reportingPeriod', 'reportingPeriod')
    .where('monitorLocation.mon_loc_id IN (:...monitoringLocationIds)', {
      monitoringLocationIds,
    })
    .andWhere('reportingPeriod.year = :year', { year })
    .andWhere('reportingPeriod.quarter = :quarter', { quarter });

  console.log({
    dailyEmissionDataQuery: dailyEmissionDataQuery.getQueryAndParameters(),
  });

  const mapped = await dailyEmissionMap.many(
    await dailyEmissionDataQuery.getMany(),
  );

  if (Array.isArray(mapped) && mapped.length > 0) {
    return mapped;
  }

  return null;
};
