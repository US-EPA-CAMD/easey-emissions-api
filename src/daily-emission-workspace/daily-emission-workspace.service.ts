import { Injectable } from '@nestjs/common';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DailyEmissionWorkspaceRepository } from './daily-emission-workspace.repository';
import { exportDailyEmissionData } from '../daily-emission-functions/export-daily-emission-data';
import { DailyFuelWorkspaceService } from '../daily-fuel-workspace/daily-fuel-workspace.service';

@Injectable()
export class DailyEmissionWorkspaceService {
  constructor(
    private readonly repository: DailyEmissionWorkspaceRepository,
    private readonly dailyFuelWorkspaceService: DailyFuelWorkspaceService,
  ) {}

  async export(monitoringLocationIds: string[], params: EmissionsParamsDTO) {
    const dailyEmissionData = await exportDailyEmissionData({
      monitoringLocationIds,
      year: params.year,
      quarter: params.quarter,
      repository: this.repository,
    });

    const promises = [];
    if (Array.isArray(dailyEmissionData) && dailyEmissionData.length > 0) {
      for (const dailyEmission of dailyEmissionData) {
        promises.push(
          this.dailyFuelWorkspaceService
            .export([dailyEmission.id])
            .then(dailyFuel => {
              dailyEmission.dailyFuelData = dailyFuel;
            }),
        );
      }
      await Promise.all(promises);
    }

    return dailyEmissionData;
  }
}
