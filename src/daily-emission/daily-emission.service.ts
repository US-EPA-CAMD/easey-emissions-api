import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DailyFuelService } from '../daily-fuel/daily-fuel.service';
import { DailyEmissionRepository } from './daily-emission.repository';
import { exportDailyEmissionData } from '../daily-emission-functions/export-daily-emission-data';

@Injectable()
export class DailyEmissionService {

  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: DailyEmissionRepository,
    private readonly dailyFuelService: DailyFuelService,
  ) {}

  async export(monitoringLocationIds: string[], params: EmissionsParamsDTO) {
    return withSlaveConnection(this.dataSource, async () => {
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
            this.dailyFuelService.export([dailyEmission.id]).then(dailyFuel => {
              dailyEmission.dailyFuelData = dailyFuel ?? [];
            }),
          );
        }
        await Promise.all(promises);
      }

      return dailyEmissionData;
    });
  }
}
