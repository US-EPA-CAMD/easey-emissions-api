import { Injectable } from '@nestjs/common';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DailyEmissionRepository } from './daily-emission.repository';
import { exportDailyEmissionData } from '../daily-emission-functions/export-daily-emission-data';

@Injectable()
export class DailyEmissionService {
  constructor(private readonly repository: DailyEmissionRepository) {}

  async export(monitoringLocationIds: string[], params: EmissionsParamsDTO) {
    return exportDailyEmissionData({
      monitoringLocationIds,
      year: params.year,
      quarter: params.quarter,
      repository: this.repository,
    });
  }
}
