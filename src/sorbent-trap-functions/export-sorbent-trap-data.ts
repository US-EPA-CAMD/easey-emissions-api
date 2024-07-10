import { SorbentTrapRepository } from '../sorbent-trap/sorbent-trap.repository';
import { SorbentTrapMap } from '../maps/sorbent-trap.map';
import { hasArrayValues } from '../utils/utils';
import { SorbentTrapWorkspaceRepository } from '../sorbent-trap-workspace/sorbent-trap-workspace.repository';

type ExportSorbentTrapDataProperties = {
  monitoringLocationIds: string[];
  year: number;
  quarter: number;
  repository: SorbentTrapRepository | SorbentTrapWorkspaceRepository;
  sorbentTrapMap?: SorbentTrapMap;
};

export const exportSorbentTrapQuery = ({
  monitoringLocationIds,
  year,
  quarter,
  repository,
}: Omit<ExportSorbentTrapDataProperties, 'sorbentTrapMap'>) => {
  return repository
    .createQueryBuilder('sorbentTrap')
    .innerJoinAndSelect('sorbentTrap.monitorLocation', 'monitorLocation')
    .leftJoinAndSelect('monitorLocation.unit', 'unit')
    .leftJoinAndSelect('monitorLocation.stackPipe', 'stack')
    .leftJoinAndSelect('sorbentTrap.monitorSystem', 'monitorSystem')
    .innerJoin('sorbentTrap.reportingPeriod', 'reportingPeriod')
    .where('monitorLocation.mon_loc_id IN (:...monitoringLocationIds)', {
      monitoringLocationIds: monitoringLocationIds,
    })
    .andWhere('reportingPeriod.year = :year', { year: year })
    .andWhere('reportingPeriod.quarter = :quarter', { quarter: quarter })
    .orderBy({
      'sorbentTrap.beginDate': 'ASC',
      'sorbentTrap.beginHour': 'ASC'
    })
    .getMany();
};

export const exportSorbentTrapData = async ({
  monitoringLocationIds,
  year,
  quarter,
  repository,
  sorbentTrapMap = new SorbentTrapMap(),
}: ExportSorbentTrapDataProperties) => {
  const sorbentTrapData = await exportSorbentTrapQuery({
    monitoringLocationIds,
    year,
    quarter,
    repository,
  });

  const mapped = await sorbentTrapMap.many(sorbentTrapData);

  if (hasArrayValues(mapped)) {
    return mapped;
  }

  return null;
};
