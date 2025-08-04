import { Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { isUndefinedOrNull } from '../utils/utils';

import { ReportingPeriod } from '../entities/reporting-period.entity';
import { EarliestPartitionQuarter } from '../entities/earliest-partition-quarter.entity';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

@Injectable()
export class EarliestPartitionQuarterChecksService {

  constructor(
    private readonly entityManager: EntityManager,
    private readonly logger: Logger,
  ) {
    this.logger.setContext('EarliestPartitionQuarterChecksService');
  }

  async runChecks(payload: EmissionsImportDTO): Promise<string[]> {

    this.logger.log('Running Earliest Partition Quarter Checks');

    const errorList = [];

    const importedReportingPeriod = await this.entityManager.findOneBy(ReportingPeriod, {
          year: payload.year,
          quarter: payload.quarter,
    });
    
    const containsData = d => !isUndefinedOrNull(d) && d.length !== 0;

    // IMPORT-39-A / IMPORT-39-B / IMPORT-39-C
    const earliestPartitionQuarterRecordForHourlyGFM = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
      tableName: 'HRLY_GAS_FLOW_METER',
    });
    const earliestPartitionQuarterRecordForMatsDerivedHourly = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
      tableName: 'MATS_DERIVED_HRLY_VALUE',
    });
    const earliestPartitionQuarterRecordForMatsMonitorHourly = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
      tableName: 'MATS_MONITOR_HRLY_VALUE',
    });

    if (importedReportingPeriod.id < earliestPartitionQuarterRecordForHourlyGFM?.reportingPeriodId) {
      if (containsData(payload.hourlyOperatingData)) {
        for (const data of payload.hourlyOperatingData) {
          if (containsData(data.hourlyGFMData)) {
            errorList.push(
              CheckCatalogService.formatResultMessage('IMPORT-39-A', {
                reportedQuarter: importedReportingPeriod.periodAbbreviation,
                earliestQuarter: earliestPartitionQuarterRecordForHourlyGFM?.reportingPeriod?.periodAbbreviation,
              }),
            );
            break;
          }
        }
      }
    }

    if (importedReportingPeriod.id < earliestPartitionQuarterRecordForMatsDerivedHourly?.reportingPeriodId) {
      if (containsData(payload.hourlyOperatingData)) {
        for (const data of payload.hourlyOperatingData) {
          if (containsData(data.matsDerivedHourlyValueData)) {
            errorList.push(
              CheckCatalogService.formatResultMessage('IMPORT-39-B', {
                reportedQuarter: importedReportingPeriod.periodAbbreviation,
                earliestQuarter: earliestPartitionQuarterRecordForMatsDerivedHourly?.reportingPeriod?.periodAbbreviation,
              }),
            );
            break;
          }
        }
      }
    }

    if (importedReportingPeriod.id < earliestPartitionQuarterRecordForMatsMonitorHourly?.reportingPeriodId) {
      if (containsData(payload.hourlyOperatingData)) {
        for (const data of payload.hourlyOperatingData) {
          if (containsData(data.matsMonitorHourlyValueData)) {
            errorList.push(
              CheckCatalogService.formatResultMessage('IMPORT-39-C', {
                reportedQuarter: importedReportingPeriod.periodAbbreviation,
                earliestQuarter: earliestPartitionQuarterRecordForMatsMonitorHourly?.reportingPeriod?.periodAbbreviation,
              }),
            );
            break;
          }
        }
      }
    }

    // IMPORT-39-D / IMPORT-39-E

    const earliestPartitionQuarterRecordForSorbentTrap = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
      tableName: 'SORBENT_TRAP',
    });
    const earliestPartitionQuarterRecordForSamplingTrain = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
      tableName: 'SAMPLING_TRAIN',
    });

    if (importedReportingPeriod.id < earliestPartitionQuarterRecordForSorbentTrap?.reportingPeriodId) { 
      if (containsData(payload.sorbentTrapData)) {
        errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-E', {
          reportedQuarter: importedReportingPeriod.periodAbbreviation,
          earliestQuarter: earliestPartitionQuarterRecordForSorbentTrap?.reportingPeriod?.periodAbbreviation,
        }));

        // SAMPLING_TRAIN is child of SORBENT_TRAP, so if any samplingTrainData exist for a failed IMPORT-39-E check record, then it also failed the IMPORT-39-D check.
        for (const data of payload.sorbentTrapData) {
          if (containsData(data.samplingTrainData)) {
            errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-D', {
              reportedQuarter: importedReportingPeriod.periodAbbreviation,
              earliestQuarter: earliestPartitionQuarterRecordForSamplingTrain?.reportingPeriod?.periodAbbreviation,
            }));
            break;
          }
        }

      }

    } else if (importedReportingPeriod.id < earliestPartitionQuarterRecordForSamplingTrain?.reportingPeriodId) {
      if (containsData(payload.sorbentTrapData)) {
        for (const data of payload.sorbentTrapData) {
          if (containsData(data.samplingTrainData)) {
            errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-D', {
              reportedQuarter: importedReportingPeriod.periodAbbreviation,
              earliestQuarter: earliestPartitionQuarterRecordForSamplingTrain?.reportingPeriod?.periodAbbreviation,
            }));
            break;
          }
        }
      }
    }

    // IMPORT-39-F / IMPORT-39-G

    const earliestPartitionQuarterRecordForWeeklyTestSummary = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
      tableName: 'WEEKLY_TEST_SUMMARY',
    });
    const earliestPartitionQuarterRecordForWeeklySystemIntergrity = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
      tableName: 'WEEKLY_SYSTEM_INTEGRITY',
    });

    if (importedReportingPeriod.id < earliestPartitionQuarterRecordForWeeklyTestSummary?.reportingPeriodId) {
      if (containsData(payload.weeklyTestSummaryData)) {
        errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-G', {
          reportedQuarter: importedReportingPeriod.periodAbbreviation,
          earliestQuarter: earliestPartitionQuarterRecordForWeeklyTestSummary?.reportingPeriod?.periodAbbreviation,
        }));

        // WEEKLY_SYSTEM_INTEGRITY is child of WEEKLY_TEST_SUMMARY, so if any weeklySystemIntegrityData exist for a failed IMPORT-39-G check record, then it also failed the IMPORT-39-F check.
        for (const data of payload.weeklyTestSummaryData) {
          if (containsData(data.weeklySystemIntegrityData)) {
            errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-F', {
              reportedQuarter: importedReportingPeriod.periodAbbreviation,
              earliestQuarter: earliestPartitionQuarterRecordForWeeklySystemIntergrity?.reportingPeriod?.periodAbbreviation,
            }));
            break;
          }
        }
      }
    } else if (importedReportingPeriod.id < earliestPartitionQuarterRecordForWeeklySystemIntergrity?.reportingPeriodId) {
      if (containsData(payload.weeklyTestSummaryData)) {
        for (const data of payload.weeklyTestSummaryData) {
          if (containsData(data.weeklySystemIntegrityData)) {
            errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-F', {
              reportedQuarter: importedReportingPeriod.periodAbbreviation,
              earliestQuarter: earliestPartitionQuarterRecordForWeeklySystemIntergrity?.reportingPeriod?.periodAbbreviation,
            }));
            break;
          }
        }
      }
    }

    // IMPORT-39-H / IMPORT-39-I / IMPORT-39-J
    const earliestPartitionQuarterRecordForNsps4tSummary = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
      tableName: 'NSPS4T_SUMMARY',
    });

    const earliestPartitionQuarterRecordForNsps4tFourthQuarter = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
      tableName: 'NSPS4T_ANNUAL',
    });

    const earliestPartitionQuarterRecordForNsps4tCompliancePeriod = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
      tableName: 'NSPS4T_COMPLIANCE_PERIOD',
    });

    if (importedReportingPeriod.id < earliestPartitionQuarterRecordForNsps4tSummary?.reportingPeriodId) {

      if (containsData(payload.nsps4tSummaryData)) {
        errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-J', {
          reportedQuarter: importedReportingPeriod.periodAbbreviation,
          earliestQuarter: earliestPartitionQuarterRecordForNsps4tSummary?.reportingPeriod?.periodAbbreviation,
        }));

        // NSPS4T_ANNUAL and NSPS4T_COMPLIANCE_PERIOD are the children of NSPS4T_SUMMARY
        // If any nsps4tFourthQuarterData and/or nsps4tCompliancePeriodData exist for a failed IMPORT-39-J check record, then it also failed the IMPORT-39- H and/or I check.
        for (const data of payload.nsps4tSummaryData) {
          if (containsData(data.nsps4tFourthQuarterData)) {
            errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-H', {
              reportedQuarter: importedReportingPeriod.periodAbbreviation,
              earliestQuarter: earliestPartitionQuarterRecordForNsps4tFourthQuarter?.reportingPeriod?.periodAbbreviation,
            }));
            break;
          }
        }

        for (const data of payload.nsps4tSummaryData) {
          if (containsData(data.nsps4tCompliancePeriodData)) {
            errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-I', {
              reportedQuarter: importedReportingPeriod.periodAbbreviation,
              earliestQuarter: earliestPartitionQuarterRecordForNsps4tCompliancePeriod?.reportingPeriod?.periodAbbreviation,
            }));
            break;
          }
        }

      }

    } else {

      // IMPORT-39-H
      if (importedReportingPeriod.id < earliestPartitionQuarterRecordForNsps4tFourthQuarter?.reportingPeriodId) {
        if (containsData(payload.nsps4tSummaryData)) {
          for (const data of payload.nsps4tSummaryData) {
            if (containsData(data.nsps4tFourthQuarterData)) {
              errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-H', {
                reportedQuarter: importedReportingPeriod.periodAbbreviation,
                earliestQuarter: earliestPartitionQuarterRecordForNsps4tFourthQuarter?.reportingPeriod?.periodAbbreviation,
              }));
              break;
            }
          }
        }

      }

      // IMPORT-39-I
      if (importedReportingPeriod.id < earliestPartitionQuarterRecordForNsps4tCompliancePeriod?.reportingPeriodId) {
        if (containsData(payload.nsps4tSummaryData)) {
          for (const data of payload.nsps4tSummaryData) {
            if (containsData(data.nsps4tCompliancePeriodData)) {
              errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-I', {
                reportedQuarter: importedReportingPeriod.periodAbbreviation,
                earliestQuarter: earliestPartitionQuarterRecordForNsps4tCompliancePeriod?.reportingPeriod?.periodAbbreviation,
              }));
              break;
            }
          }
        }
      }
    }

    // IMPORT-39-K
    const earliestPartitionQuarterRecord = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
      tableName: 'DAILY_BACKSTOP',
    });

    if (importedReportingPeriod?.id < earliestPartitionQuarterRecord?.reportingPeriodId) {
      if (containsData(payload.dailyBackstopData)) {
        errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-K', {
          reportedQuarter: importedReportingPeriod?.periodAbbreviation,
          earliestQuarter: earliestPartitionQuarterRecord?.reportingPeriod?.periodAbbreviation,
        }));
      }
    }

    return errorList;
  }

}