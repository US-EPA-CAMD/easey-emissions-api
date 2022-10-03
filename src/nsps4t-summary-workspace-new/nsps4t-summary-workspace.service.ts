import { Nsps4tSummaryWorkspaceRepository } from './nsps4t-summary-workspace.repository';
import { Nsps4tAnnualWorkspaceService } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.service';
import { Nsps4tCompliancePeriodWorkspaceService } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.service';
import {
  importNsps4tSummaryData,
  Nsps4tSummaryDataCreate,
} from '../nsps4t-summary-functions/import-nsps4t-summary-data';
import { Injectable } from '@nestjs/common';
import { hasArrayValues } from '../utils/utils';

@Injectable()
export class Nsps4tSummaryWorkspaceService {
  constructor(
    private readonly repository: Nsps4tSummaryWorkspaceRepository,
    private readonly nsps4tAnnualService: Nsps4tAnnualWorkspaceService,
    private readonly nsps4tCompliancePeriodService: Nsps4tCompliancePeriodWorkspaceService,
  ) {}

  async import(data: Nsps4tSummaryDataCreate) {
    const nsps4tSummaryData = await importNsps4tSummaryData({
      data,
      repository: this.repository,
    });

    const promises = [];

    for (const nsps4tFourthQuarter of data.nsps4tFourthQuarterData) {
      promises.push(
        this.nsps4tAnnualService
          .import({
            ...nsps4tFourthQuarter,
            nsps4tSumId: nsps4tSummaryData.id,
            reportingPeriodId: data.reportingPeriodId,
            monitoringLocationId: data.monitoringLocationId,
            identifiers: data.identifiers,
          })
          .then(data => {
            if (data && !hasArrayValues(nsps4tSummaryData.nsps4tAnnualData)) {
              nsps4tSummaryData.nsps4tAnnualData = [data];
            } else if (data) {
              nsps4tSummaryData.nsps4tAnnualData.push(data);
            }
          }),
      );
    }

    for (const nsps4tCompliancePeriod of data.nsps4tCompliancePeriodData) {
      promises.push(
        this.nsps4tCompliancePeriodService
          .import({
            ...nsps4tCompliancePeriod,
            nsps4tSumId: nsps4tSummaryData.id,
            reportingPeriodId: data.reportingPeriodId,
            monitoringLocationId: data.monitoringLocationId,
            identifiers: data.identifiers,
          })
          .then(data => {
            if (
              data &&
              !hasArrayValues(nsps4tSummaryData.nsps4tCompliancePeriodData)
            ) {
              nsps4tSummaryData.nsps4tCompliancePeriodData = [data];
            } else if (data) {
              nsps4tSummaryData.nsps4tCompliancePeriodData.push(data);
            }
          }),
      );
    }

    await Promise.all(promises);

    return nsps4tSummaryData;
  }
}
