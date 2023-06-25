import { Injectable } from '@nestjs/common';

import { DailyEmissionDTO } from 'src/dto/daily-emission.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DailyFuelService } from '../daily-fuel/daily-fuel.service';
import { DailyEmissionRepository } from './daily-emission.repository';
import { exportDailyEmissionData } from '../daily-emission-functions/export-daily-emission-data';

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
  }

  async removeNonReportedValues(dailyEmissionData: DailyEmissionDTO[]) {
    const promises = [];
    dailyEmissionData.forEach(dto => {
      promises.push(this.dailyFuelService.removeNonReportedValues(dto.dailyFuelData));
      delete dto.id;
      delete dto.monitoringLocationId;
      delete dto.reportingPeriodId;
      delete dto.calcTotalDailyEmissions;
      delete dto.calcTotalOpTime;
      delete dto.userId;
      delete dto.addDate;
      delete dto.updateDate;
    });

    await Promise.all(promises);
  }
}
