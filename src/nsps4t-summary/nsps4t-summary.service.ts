import { Injectable } from '@nestjs/common';
import { Nsps4tSummaryRepository } from './nsps4t-summary.repository';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { exportNsps4tSummaryData } from '../nsps4t-summary-functions/export-nsps4t-summary-data';

@Injectable()
export class Nsps4tSummaryService {
  constructor(private readonly repository: Nsps4tSummaryRepository) {}

  async export(monitoringLocationIds: string[], params: EmissionsParamsDTO) {
    return exportNsps4tSummaryData({
      monitoringLocationIds,
      year: params.year,
      quarter: params.quarter,
      repository: this.repository,
    });
  }
}
