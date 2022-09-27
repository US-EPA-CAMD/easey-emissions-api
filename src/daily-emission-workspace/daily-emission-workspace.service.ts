import { Injectable } from '@nestjs/common';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DailyEmissionWorkspaceRepository } from './daily-emission-workspace.repository';
import { exportDailyEmissionData } from '../daily-emission-functions/export-daily-emission-data';

@Injectable()
export class DailyEmissionWorkspaceService {
  constructor(private readonly repository: DailyEmissionWorkspaceRepository) {}

  async export(monitoringLocationIds: string[], params: EmissionsParamsDTO) {
    return exportDailyEmissionData({
      monitoringLocationIds,
      year: params.year,
      quarter: params.quarter,
      repository: this.repository,
    });
  }
}
