import { Injectable } from '@nestjs/common';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DailyEmissionRepository } from './daily-emission.repository';
import { exportDailyEmissionData } from '../daily-emission-functions/export-daily-emission-data';
import { DailyFuelService } from '../daily-fuel/daily-fuel.service';

@Injectable()
export class DailyEmissionService {
  constructor(
    private readonly repository: DailyEmissionRepository,
    private readonly dailyFuelService: DailyFuelService,
  ) {}

  async export(monitoringLocationIds: string[], params: EmissionsParamsDTO) {
    const dailyEmissionData = await exportDailyEmissionData({
      monitoringLocationIds,
      year: params.year,
      quarter: params.quarter,
      repository: this.repository,
    });

    const promises = [];
    for (const dailyEmission of dailyEmissionData) {
      promises.push(
        this.dailyFuelService.export([dailyEmission.id]).then(dailyFuel => {
          dailyEmission.dailyFuelData = dailyFuel;
        }),
      );
    }
    await Promise.all(promises);

    return dailyEmissionData;
  }
}
