import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';
import { Nsps4tCompliancePeriodRepository } from './nsps4t-compliance-period.repository';
import { Nsps4tCompliancePeriodDTO } from '../dto/nsps4t-compliance-period.dto';
import { exportNps4tCompliancePeriodData } from '../nsps4t-compliance-period-functions/export-nsps4t-compliance-period-data';

@Injectable()
export class Nsps4tCompliancePeriodService {

  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async export(
    nsps4tSummaryIds: string[],
  ): Promise<Nsps4tCompliancePeriodDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      const nsps4tCompliancePeriodRepository = new Nsps4tCompliancePeriodRepository(replicaManager);
      return exportNps4tCompliancePeriodData({
        nsps4tSummaryIds,
        repository: nsps4tCompliancePeriodRepository,
      });
    });
  }
}
