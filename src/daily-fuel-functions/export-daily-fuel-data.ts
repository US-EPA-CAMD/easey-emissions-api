import { DailyFuelRepository } from '../daily-fuel/daily-fuel.repository';
import { DailyFuelWorkspaceRepository } from '../daily-fuel-workspace/daily-fuel-workspace.repository';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { DailyFuelDTO } from '../dto/daily-fuel.dto';

type ExportDailyFuelDataProperties = {
  dailyEmissionIds: string[];
  repository: DailyFuelRepository | DailyFuelWorkspaceRepository;
  map?: DailyFuelMap;
};

export const exportDailyFuelQuery = async ({
  dailyEmissionIds,
  repository,
}: Omit<ExportDailyFuelDataProperties, 'map'>) => {
  return repository
    .createQueryBuilder('dailyFuel')
    .where('dailyFuel.dailyEmissionId IN (:...dailyEmissionIds)', {
      dailyEmissionIds,
    })
    .getMany();
};

export const exportDailyFuelData = async ({
  dailyEmissionIds,
  repository,
  map = new DailyFuelMap(),
}: ExportDailyFuelDataProperties): Promise<DailyFuelDTO[] | null> => {
  const dailyFuelData = await exportDailyFuelQuery({
    dailyEmissionIds,
    repository,
  });

  const mapped = await map.many(dailyFuelData);

  if (Array.isArray(mapped) && mapped.length > 0) {
    return mapped;
  }

  return null;
};
