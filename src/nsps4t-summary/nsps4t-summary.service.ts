import { Nsps4tCompliancePeriod } from './../entities/nsps4t-compliance-period.entity';
import { Injectable } from '@nestjs/common';
import { Nsps4tSummaryRepository } from './nsps4t-summary.repository';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { exportNsps4tSummaryData } from '../nsps4t-summary-functions/export-nsps4t-summary-data';
import { Nsps4tCompliancePeriodService } from '../nsps4t-compliance-period/nsps4t-compliance-period.service';
import { Nsps4tAnnualService } from '../nsps4t-annual/nsps4t-annual.service';
import { arrayPushCreate, hasArrayValues } from '../utils/utils';
import { Nsps4tSummaryDTO } from 'src/dto/nsps4t-summary.dto';

@Injectable()
export class Nsps4tSummaryService {

  constructor(
    private readonly repository: Nsps4tSummaryRepository,
    private readonly nsps4tAnnualService: Nsps4tAnnualService,
    private readonly nsps4tCompliancePeriodService: Nsps4tCompliancePeriodService,
  ) {}

  async export(monitoringLocationIds: string[], params: EmissionsParamsDTO) {
    const nsps4tSummaryData = await exportNsps4tSummaryData({
      monitoringLocationIds,
      year: params.year,
      quarter: params.quarter,
      repository: this.repository,
    });

    if (hasArrayValues(nsps4tSummaryData)) {
      const promises = [];
      for (const nsps4tSummary of nsps4tSummaryData) {
        promises.push(
          this.nsps4tAnnualService.export([nsps4tSummary.id]).then(data => {
            nsps4tSummary.nsps4tFourthQuarterData =
              arrayPushCreate(nsps4tSummary.nsps4tFourthQuarterData, data) ??
              [];
          }),
          this.nsps4tCompliancePeriodService
            .export([nsps4tSummary.id])
            .then(data => {
              nsps4tSummary.nsps4tCompliancePeriodData =
                arrayPushCreate(
                  nsps4tSummary.nsps4tCompliancePeriodData,
                  data,
                ) ?? [];
            }),
        );
      }
      await Promise.all(promises);
    }

    return nsps4tSummaryData;
  }

  async removeNonReportedValues(nsps4tSummaryData: Nsps4tSummaryDTO[]) {
    const promises = [];
    nsps4tSummaryData.forEach(dto => {
      promises.push(this.nsps4tAnnualService.removeNonReportedValues(dto.nsps4tFourthQuarterData));
      promises.push(this.nsps4tCompliancePeriodService.removeNonReportedValues(dto.nsps4tCompliancePeriodData));
      delete dto.id;
      delete dto.monitoringLocationId;
      delete dto.reportingPeriodId;
      delete dto.userId;
      delete dto.addDate;
      delete dto.updateDate;
    });

    await Promise.all(promises);
  }
}
