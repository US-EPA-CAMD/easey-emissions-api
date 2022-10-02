import { DailyFuelRepository } from '../daily-fuel/daily-fuel.repository';
import { DailyFuelWorkspaceRepository } from '../daily-fuel-workspace/daily-fuel-workspace.repository';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { DailyFuelDTO } from '../dto/daily-fuel.dto';

type ExportDailyFuelDataProperties = {
  dailyEmissionIds: string[];
  repository: DailyFuelRepository | DailyFuelWorkspaceRepository;
  map?: DailyFuelMap;
};

export const exportDailyFuelData = async ({
  dailyEmissionIds,
  repository,
  map = new DailyFuelMap(),
}: ExportDailyFuelDataProperties): Promise<DailyFuelDTO[] | null> => {
  const dailyFuelQuery = repository
    .createQueryBuilder('dailyFuel')
    .where('dailyFuel.dailyEmissionId IN (:...dailyEmissionIds)', {
      dailyEmissionIds,
    });

  const dailyFuelData = await dailyFuelQuery.getMany();

  const mapped = await map.many(dailyFuelData);

  if (Array.isArray(mapped) && mapped.length > 0) {
    return mapped;
  }

  return null;
};
