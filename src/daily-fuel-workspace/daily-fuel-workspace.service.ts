import { Injectable } from '@nestjs/common';
import { DailyFuelDTO } from '../dto/daily-fuel.dto';
import { exportDailyFuelData } from '../daily-fuel-functions/export-daily-fuel-data';
import { DailyFuelWorkspaceRepository } from './daily-fuel-workspace.repository';

@Injectable()
export class DailyFuelWorkspaceService {
  constructor(private readonly repository: DailyFuelWorkspaceRepository) {}

  async export(dailyEmissionIds: string[]): Promise<DailyFuelDTO[]> {
    return exportDailyFuelData({
      dailyEmissionIds,
      repository: this.repository,
    });
  }
}
