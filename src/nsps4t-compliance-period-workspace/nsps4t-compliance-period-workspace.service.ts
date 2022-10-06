import { Injectable } from '@nestjs/common';
import {
  importNsps4tCompliancePeriodData,
  Nsps4tCompliancePeriodDataCreate,
} from '../nsps4t-compliance-period-functions/import-nsps4t-compliance-period-data';
import { Nsps4tCompliancePeriodWorkspaceRepository } from './nsps4t-compliance-period-workspace.repository';
import { Nsps4tCompliancePeriod } from '../entities/workspace/nsps4t-compliance-period.entity';
import { Nsps4tCompliancePeriodDTO } from '../dto/nsps4t-compliance-period.dto';
import { exportNps4tCompliancePeriodData } from '../nsps4t-compliance-period-functions/export-nsps4t-compliance-period-data';

@Injectable()
export class Nsps4tCompliancePeriodWorkspaceService {
  constructor(
    private readonly repository: Nsps4tCompliancePeriodWorkspaceRepository,
  ) {}

  async export(
    nsps4tSummaryIds: string[],
  ): Promise<Nsps4tCompliancePeriodDTO[]> {
    return exportNps4tCompliancePeriodData({
      nsps4tSummaryIds,
      repository: this.repository,
    });
  }

  async import(
    data: Nsps4tCompliancePeriodDataCreate,
  ): Promise<Nsps4tCompliancePeriod> {
    return importNsps4tCompliancePeriodData({
      data,
      repository: this.repository,
    });
  }
}
