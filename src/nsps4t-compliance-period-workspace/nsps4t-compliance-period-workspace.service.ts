import { Injectable } from '@nestjs/common';
import {
  importNsps4tCompliancePeriodData,
  Nsps4tCompliancePeriodDataCreate,
} from '../nsps4t-compliance-period-functions/import-nsps4t-compliance-period-data';
import { Nsps4tCompliancePeriodWorkspaceRepository } from './nsps4t-compliance-period-workspace.repository';
import { Nsps4tCompliancePeriod } from '../entities/workspace/nsps4t-compliance-period.entity';

@Injectable()
export class Nsps4tCompliancePeriodWorkspaceService {
  constructor(
    private readonly repository: Nsps4tCompliancePeriodWorkspaceRepository,
  ) {}

  async import(
    data: Nsps4tCompliancePeriodDataCreate,
  ): Promise<Nsps4tCompliancePeriod> {
    return importNsps4tCompliancePeriodData({
      data,
      repository: this.repository,
    });
  }
}
