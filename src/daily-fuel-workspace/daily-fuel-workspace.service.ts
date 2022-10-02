import { Injectable } from '@nestjs/common';
import { DailyFuelDTO, DailyFuelImportDTO } from '../dto/daily-fuel.dto';
import { exportDailyFuelData } from '../daily-fuel-functions/export-daily-fuel-data';
import { DailyFuelWorkspaceRepository } from './daily-fuel-workspace.repository';
import { randomUUID } from 'crypto';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

export type DailyFuelWorkspaceCreate = DailyFuelImportDTO & {
  dailyEmissionId: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
  identifiers: ImportIdentifiers;
};

@Injectable()
export class DailyFuelWorkspaceService {
  constructor(
    private readonly map: DailyFuelMap,
    private readonly repository: DailyFuelWorkspaceRepository,
  ) {}

  async export(dailyEmissionIds: string[]): Promise<DailyFuelDTO[]> {
    return exportDailyFuelData({
      dailyEmissionIds,
      repository: this.repository,
    });
  }

  async import(data: DailyFuelWorkspaceCreate) {
    return this.repository.save(
      this.repository.create({
        id: randomUUID(),
        dailyEmissionId: data.dailyEmissionId,
        fuelCode: data.fuelCode,
        dailyFuelFeed: data.dailyFuelFeed,
        carbonContentUsed: data.carbonContentUsed,
        fuelCarbonBurned: data.fuelCarbonBurned,
        reportingPeriodId: data.reportingPeriodId,
        monitoringLocationId: data.monitoringLocationId,
        addDate: new Date().toISOString(),
        userId: data.identifiers.userId,
      }),
    );
  }
}
