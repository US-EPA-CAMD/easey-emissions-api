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

    if (importedReportingPeriod.id < earliestPartitionQuarterRecordForHourlyGFM?.reportingPeriodId
      || importedReportingPeriod.id < earliestPartitionQuarterRecordForMatsDerivedHourly?.reportingPeriodId
      || importedReportingPeriod.id < earliestPartitionQuarterRecordForMatsMonitorHourly?.reportingPeriodId) {

        if (containsData(payload.hourlyOperatingData)) {
          let IMPORT39A_Found = false;
          let IMPORT39B_Found = false;
          let IMPORT39C_Found = false;
  
          for (const data of payload.hourlyOperatingData) {
            if (importedReportingPeriod.id < earliestPartitionQuarterRecordForHourlyGFM?.reportingPeriodId && containsData(data.hourlyGFMData)) {
              IMPORT39A_Found = true;
            }
            
            if (importedReportingPeriod.id < earliestPartitionQuarterRecordForMatsDerivedHourly?.reportingPeriodId && containsData(data.matsDerivedHourlyValueData)) {
              IMPORT39B_Found = true;
            }
  
            if (importedReportingPeriod.id < earliestPartitionQuarterRecordForMatsMonitorHourly?.reportingPeriodId && containsData(data.matsMonitorHourlyValueData)) {
              IMPORT39C_Found = true;
            }

            if (IMPORT39A_Found && IMPORT39B_Found && IMPORT39C_Found) break;
          }
  
          if (IMPORT39A_Found) {
            errorList.push(
              CheckCatalogService.formatResultMessage('IMPORT-39-A', {
                reportedQuarter: importedReportingPeriod.periodAbbreviation,
                earliestQuarter: earliestPartitionQuarterRecordForHourlyGFM?.reportingPeriod?.periodAbbreviation,
              }),
            );
          }
  
          if (IMPORT39B_Found) {
            errorList.push(
              CheckCatalogService.formatResultMessage('IMPORT-39-B', {
                reportedQuarter: importedReportingPeriod.periodAbbreviation,
                earliestQuarter: earliestPartitionQuarterRecordForMatsDerivedHourly?.reportingPeriod?.periodAbbreviation,
              }),
            );
          }
  
          if (IMPORT39C_Found) {
            errorList.push(
              CheckCatalogService.formatResultMessage('IMPORT-39-C', {
                reportedQuarter: importedReportingPeriod.periodAbbreviation,
                earliestQuarter: earliestPartitionQuarterRecordForMatsMonitorHourly?.reportingPeriod?.periodAbbreviation,
              }),
            );
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

    if (importedReportingPeriod.id < earliestPartitionQuarterRecordForSorbentTrap?.reportingPeriodId
      || importedReportingPeriod.id < earliestPartitionQuarterRecordForSamplingTrain?.reportingPeriodId) {
        if (containsData(payload.sorbentTrapData)) {
          if (importedReportingPeriod.id < earliestPartitionQuarterRecordForSorbentTrap?.reportingPeriodId) {
            errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-E', {
              reportedQuarter: importedReportingPeriod.periodAbbreviation,
              earliestQuarter: earliestPartitionQuarterRecordForSorbentTrap?.reportingPeriod?.periodAbbreviation,
            }));
          }
  
          if (importedReportingPeriod.id < earliestPartitionQuarterRecordForSamplingTrain?.reportingPeriodId) {
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
      }

    // IMPORT-39-F / IMPORT-39-G
    const earliestPartitionQuarterRecordForWeeklyTestSummary = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
      tableName: 'WEEKLY_TEST_SUMMARY',
    });
    const earliestPartitionQuarterRecordForWeeklySystemIntergrity = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
      tableName: 'WEEKLY_SYSTEM_INTEGRITY',
    });

    if (importedReportingPeriod.id < earliestPartitionQuarterRecordForWeeklyTestSummary?.reportingPeriodId
      || importedReportingPeriod.id < earliestPartitionQuarterRecordForWeeklySystemIntergrity?.reportingPeriodId) {
        if (containsData(payload.weeklyTestSummaryData)) {
          if (importedReportingPeriod.id < earliestPartitionQuarterRecordForWeeklyTestSummary?.reportingPeriodId) {
            errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-G', {
              reportedQuarter: importedReportingPeriod.periodAbbreviation,
              earliestQuarter: earliestPartitionQuarterRecordForWeeklyTestSummary?.reportingPeriod?.periodAbbreviation,
            }));
          }
  
          if (importedReportingPeriod.id < earliestPartitionQuarterRecordForWeeklySystemIntergrity?.reportingPeriodId) {
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

    if (importedReportingPeriod.id < earliestPartitionQuarterRecordForNsps4tSummary?.reportingPeriodId
      || importedReportingPeriod.id < earliestPartitionQuarterRecordForNsps4tFourthQuarter?.reportingPeriodId
      || importedReportingPeriod.id < earliestPartitionQuarterRecordForNsps4tCompliancePeriod?.reportingPeriodId) {
        if (containsData(payload.nsps4tSummaryData)) {
          if (importedReportingPeriod.id < earliestPartitionQuarterRecordForNsps4tSummary?.reportingPeriodId) {
            errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-J', {
              reportedQuarter: importedReportingPeriod.periodAbbreviation,
              earliestQuarter: earliestPartitionQuarterRecordForNsps4tSummary?.reportingPeriod?.periodAbbreviation,
            }));
          }
  
          if (importedReportingPeriod.id < earliestPartitionQuarterRecordForNsps4tFourthQuarter?.reportingPeriodId
            || importedReportingPeriod.id < earliestPartitionQuarterRecordForNsps4tCompliancePeriod?.reportingPeriodId
          ) {
            let IMPORT39H_Found = false;
            let IMPORT39I_Found = false;
            for (const data of payload.nsps4tSummaryData)  {
              if (containsData(data.nsps4tFourthQuarterData)) {
                IMPORT39H_Found = true;
              }
              if (containsData(data.nsps4tCompliancePeriodData)) {
                IMPORT39I_Found = true;
              }
              
              if (IMPORT39H_Found && IMPORT39I_Found) break;
            }
            if (IMPORT39H_Found) {
              errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-H', {
                reportedQuarter: importedReportingPeriod.periodAbbreviation,
                earliestQuarter: earliestPartitionQuarterRecordForNsps4tFourthQuarter?.reportingPeriod?.periodAbbreviation,
              }));
            }
            if (IMPORT39I_Found) {
              errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-I', {
                reportedQuarter: importedReportingPeriod.periodAbbreviation,
                earliestQuarter: earliestPartitionQuarterRecordForNsps4tCompliancePeriod?.reportingPeriod?.periodAbbreviation,
              }));
            }
          }
        }
      }

    // IMPORT-39-K
    const earliestPartitionQuarterRecordForDailyBackstop = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
      tableName: 'DAILY_BACKSTOP',
    });

    if (importedReportingPeriod?.id < earliestPartitionQuarterRecordForDailyBackstop?.reportingPeriodId) {
      if (containsData(payload.dailyBackstopData)) {
        errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-K', {
          reportedQuarter: importedReportingPeriod?.periodAbbreviation,
          earliestQuarter: earliestPartitionQuarterRecordForDailyBackstop?.reportingPeriod?.periodAbbreviation,
        }));
      }
    }

    return errorList;
  }

}