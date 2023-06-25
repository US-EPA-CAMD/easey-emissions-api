import { Injectable } from '@nestjs/common';
import { Nsps4tCompliancePeriodRepository } from './nsps4t-compliance-period.repository';
import { Nsps4tCompliancePeriodDTO } from '../dto/nsps4t-compliance-period.dto';
import { exportNps4tCompliancePeriodData } from '../nsps4t-compliance-period-functions/export-nsps4t-compliance-period-data';

@Injectable()
export class Nsps4tCompliancePeriodService {

  constructor(private readonly repository: Nsps4tCompliancePeriodRepository) {}

  async export(
    nsps4tSummaryIds: string[],
  ): Promise<Nsps4tCompliancePeriodDTO[]> {
    return exportNps4tCompliancePeriodData({
      nsps4tSummaryIds,
      repository: this.repository,
    });
  }

  async removeNonReportedValues(nsps4tCompliancePeriodData: Nsps4tCompliancePeriodDTO[]) {
    nsps4tCompliancePeriodData.forEach(dto => {
      delete dto.id;
      delete dto.nsps4tSumId;
      delete dto.reportingPeriodId;
      delete dto.monitoringLocationId;
      delete dto.userId;
      delete dto.addDate;
      delete dto.updateDate;
    })
  }
}
