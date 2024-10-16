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

export const exportDailyEmissionQuery = async ({
  monitoringLocationIds,
  year,
  quarter,
  repository,
}: Omit<ExportDailyEmissionDataProperties, 'dailyEmissionMap'>) => {
  return repository
    .createQueryBuilder('dailyEmission')
    .innerJoinAndSelect('dailyEmission.monitorLocation', 'monitorLocation')
    .leftJoinAndSelect('monitorLocation.unit', 'unit')
    .leftJoinAndSelect('monitorLocation.stackPipe', 'stack')
    .innerJoin('dailyEmission.reportingPeriod', 'reportingPeriod')
    .where('monitorLocation.mon_loc_id IN (:...monitoringLocationIds)', {
      monitoringLocationIds,
    })
    .andWhere('reportingPeriod.year = :year', { year })
    .andWhere('reportingPeriod.quarter = :quarter', { quarter })
    .orderBy({
      'dailyEmission.date': 'ASC',
    })
    .getMany();
};

export const exportDailyEmissionData = async ({
  monitoringLocationIds,
  year,
  quarter,
  repository,
  dailyEmissionMap = new DailyEmissionMap(),
}: ExportDailyEmissionDataProperties): Promise<DailyEmissionDTO[] | null> => {
  const dailyEmissionData = await exportDailyEmissionQuery({
    monitoringLocationIds,
    year,
    quarter,
    repository,
  });

  const mapped = await dailyEmissionMap.many(dailyEmissionData);

  if (Array.isArray(mapped) && mapped.length > 0) {
    return mapped;
  }

  return null;
};
