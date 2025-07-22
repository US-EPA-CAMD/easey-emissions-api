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
    if (containsData(payload.hourlyOperatingData)) {

        let import39A_found = false;
        let import39B_found = false;
        let import39C_found = false;

        const earliestPartitionQuarterRecordForHourlyGFM = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
            tableName: 'HRLY_GAS_FLOW_METER',
        });
        const earliestPartitionQuarterRecordForMatsDerivedHourly = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
            tableName: 'MATS_DERIVED_HRLY_VALUE',
        });
        const earliestPartitionQuarterRecordForMatsMonitorHourly = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
            tableName: 'MATS_MONITOR_HRLY_VALUE',
        });

      
        for (const data of payload.hourlyOperatingData) {

          if (
            !import39A_found &&
            containsData(data.hourlyGFMData) &&
            importedReportingPeriod.id < earliestPartitionQuarterRecordForHourlyGFM?.reportingPeriodId
          ) {
            import39A_found = true;
          }

          if (
            !import39B_found &&
            containsData(data.matsDerivedHourlyValueData) &&
            importedReportingPeriod.id <
            earliestPartitionQuarterRecordForMatsDerivedHourly?.reportingPeriodId
          ) {
            import39B_found = true;
          }

          if (
            !import39C_found &&
            containsData(data.matsMonitorHourlyValueData) &&
            importedReportingPeriod.id <
            earliestPartitionQuarterRecordForMatsMonitorHourly?.reportingPeriodId
          ) {
            import39C_found = true;
          }

          if (import39A_found && import39B_found && import39C_found) {
            break;
          }
        }

        if (import39A_found) {
          errorList.push(
            CheckCatalogService.formatResultMessage('IMPORT-39-A', {
              reportedQuarter: importedReportingPeriod.periodAbbreviation,
              earliestQuarter: earliestPartitionQuarterRecordForHourlyGFM?.reportingPeriod?.periodAbbreviation,
            }),
          );
        }

        if (import39B_found) {
          errorList.push(
            CheckCatalogService.formatResultMessage('IMPORT-39-B', {
              reportedQuarter: importedReportingPeriod.periodAbbreviation,
              earliestQuarter: earliestPartitionQuarterRecordForMatsDerivedHourly?.reportingPeriod?.periodAbbreviation,
            }),
          );
        }
      
        if (import39C_found) {
          errorList.push(
            CheckCatalogService.formatResultMessage('IMPORT-39-C', {
              reportedQuarter: importedReportingPeriod.periodAbbreviation,
              earliestQuarter: earliestPartitionQuarterRecordForMatsMonitorHourly?.reportingPeriod?.periodAbbreviation,
            }),
          );
        }
    }

    if (containsData(payload.sorbentTrapData)) {

        let earliestPartitionQuarterRecord = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
            tableName: 'SORBENT_TRAP',
        });

        if ( importedReportingPeriod.id < earliestPartitionQuarterRecord?.reportingPeriodId) {
            errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-E', {
                reportedQuarter: importedReportingPeriod.periodAbbreviation,
                earliestQuarter: earliestPartitionQuarterRecord?.reportingPeriod?.periodAbbreviation,
            }));
            for (const data of payload.sorbentTrapData) {
                if (containsData(data.samplingTrainData)) {
                    earliestPartitionQuarterRecord = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
                        tableName: 'SAMPLING_TRAIN',
                    });
                    if (importedReportingPeriod.id < earliestPartitionQuarterRecord?.reportingPeriodId) {
                        errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-D', {
                            reportedQuarter: importedReportingPeriod.periodAbbreviation,
                            earliestQuarter: earliestPartitionQuarterRecord?.reportingPeriod?.periodAbbreviation,
                        }));
                        break;
                    }
                }
            }
        }
        
    }

    if (containsData(payload.weeklyTestSummaryData)) {

        let earliestPartitionQuarterRecord = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
            tableName: 'WEEKLY_TEST_SUMMARY',
        });

        if ( importedReportingPeriod.id < earliestPartitionQuarterRecord?.reportingPeriodId) {
            errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-G', {
                reportedQuarter: importedReportingPeriod.periodAbbreviation,
                earliestQuarter: earliestPartitionQuarterRecord?.reportingPeriod?.periodAbbreviation,
            }));
            for (const data of payload.weeklyTestSummaryData) {

                if (containsData(data.weeklySystemIntegrityData)) {

                    earliestPartitionQuarterRecord = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
                        tableName: 'WEEKLY_SYSTEM_INTEGRITY',
                    });

                    if (importedReportingPeriod.id < earliestPartitionQuarterRecord?.reportingPeriodId) {
                        errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-F', {
                            reportedQuarter: importedReportingPeriod.periodAbbreviation,
                            earliestQuarter: earliestPartitionQuarterRecord?.reportingPeriod?.periodAbbreviation,
                        }));
                        break;
                    }
                }
            }
        }
    }

    if (containsData(payload.nsps4tSummaryData)) {
        const earliestPartitionQuarterRecordForNsps4tSummary = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
            tableName: 'NSPS4T_SUMMARY',
        });

        if ( importedReportingPeriod.id < earliestPartitionQuarterRecordForNsps4tSummary?.reportingPeriodId) {
            errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-J', {
                reportedQuarter: importedReportingPeriod.periodAbbreviation,
                earliestQuarter: earliestPartitionQuarterRecordForNsps4tSummary?.reportingPeriod?.periodAbbreviation,
            }));
            let import39H_found = false;
            let import39I_found = false;

            const earliestPartitionQuarterRecordForNsps4tFourthQuarter = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
                tableName: 'NSPS4T_ANNUAL',
            });

            const earliestPartitionQuarterRecordForNsps4tCompliancePeriod = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
                tableName: 'NSPS4T_COMPLIANCE_PERIOD',
            });

            for (const data of payload.nsps4tSummaryData) {
              if (
                !import39H_found &&
                containsData(data.nsps4tFourthQuarterData) &&
                importedReportingPeriod.id < earliestPartitionQuarterRecordForNsps4tFourthQuarter?.reportingPeriodId
              ) {
                import39H_found = true;
              }

              if (
                !import39I_found &&
                containsData(data.nsps4tCompliancePeriodData) &&
                importedReportingPeriod.id <
                earliestPartitionQuarterRecordForNsps4tCompliancePeriod?.reportingPeriodId
              ) {
                import39I_found = true;
              }

              if (import39H_found && import39I_found) {
                break;
              }
            }

            if (import39H_found) {
              errorList.push(
                CheckCatalogService.formatResultMessage('IMPORT-39-H', {
                  reportedQuarter: importedReportingPeriod.periodAbbreviation,
                  earliestQuarter: earliestPartitionQuarterRecordForNsps4tFourthQuarter?.reportingPeriod?.periodAbbreviation, // TODO: Replace with actual value
                }),
              );
            }
        
            if (import39I_found) {
              errorList.push(
                CheckCatalogService.formatResultMessage('IMPORT-39-I', {
                  reportedQuarter: importedReportingPeriod.periodAbbreviation,
                  earliestQuarter: earliestPartitionQuarterRecordForNsps4tCompliancePeriod?.reportingPeriod?.periodAbbreviation, // TODO: Replace with actual value
                }),
              );
            }
        }
    }
    
    if (containsData(payload.dailyBackstopData)) {

        const earliestPartitionQuarterRecord = await this.entityManager.findOneBy(EarliestPartitionQuarter, {
            tableName: 'DAILY_BACKSTOP',
        });

        if (importedReportingPeriod?.id < earliestPartitionQuarterRecord?.reportingPeriodId) {
            errorList.push(CheckCatalogService.formatResultMessage('IMPORT-39-K', {
                reportedQuarter: importedReportingPeriod?.periodAbbreviation,
                earliestQuarter: earliestPartitionQuarterRecord?.reportingPeriod?.periodAbbreviation,
            }));
        }
    }

    return errorList;
  }

}