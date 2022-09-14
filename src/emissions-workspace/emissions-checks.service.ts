import { HttpStatus, Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { EmissionsImportDTO } from '../dto/emissions.dto';
import { MonitorLocationChecksService } from '../monitor-location-workspace/monitor-location-checks.service';
import { WeeklyTestSummaryCheckService } from '../weekly-test-summary-workspace/weekly-test-summary-check.service';
import { DailyTestSummaryCheckService } from '../daily-test-summary-workspace/daily-test-summary-check.service';
import { isUndefinedOrNull } from '../utils/utils';

@Injectable()
export class EmissionsChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly weeklyTestSummaryCheckService: WeeklyTestSummaryCheckService,
    private readonly dailyTestSummaryCheckService: DailyTestSummaryCheckService,
    private readonly monitorLocationCheckService: MonitorLocationChecksService,
  ) {}
  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(payload: EmissionsImportDTO): Promise<string[]> {
    this.logger.info('Running Emissions Import Checks');

    const errorList: string[] = [];

    // IMPORT-29: Inappropriate Children Records for Daily Test Summary
    const dailyTestSummaryCheckErrors = this.dailyTestSummaryCheckService.runChecks(
      payload,
    );

    const weeklyTestSummaryCheckErrors = this.weeklyTestSummaryCheckService.runChecks(
      payload,
    );

    const invalidDatesCheckErrors = this.invalidDatesCheck(payload);

    // IMPORT-27: All EM Components Present in the Production Database
    const [, locationErrors] = await this.monitorLocationCheckService.runChecks(
      payload,
    );

    errorList.push(
      ...weeklyTestSummaryCheckErrors,
      ...invalidDatesCheckErrors,
      ...locationErrors,
      ...dailyTestSummaryCheckErrors,
    );

    this.throwIfErrors(errorList);
    this.logger.info('Completed Emissions Import Checks');

    return errorList;
  }

  // IMPORT-23: Emission File Dates Valid
  invalidDatesCheck(payload: EmissionsImportDTO): string[] {
    let earliestDate: number;
    let latestDate: number;

    const dateCheck = (date: Date) => {
      if (isUndefinedOrNull(date)) {
        return;
      }

      const year = new Date(date).getFullYear();
      const quarter = Math.floor(new Date(date).getMonth() / 3 + 1);
      const combo = Number(`${year}${quarter}`);

      if (typeof earliestDate === 'undefined' || combo < earliestDate) {
        earliestDate = combo;
      }

      if (typeof latestDate === 'undefined' || combo > latestDate) {
        latestDate = combo;
      }
    };

    payload.dailyEmissionData?.forEach(datum => {
      dateCheck(datum.date);
    });

    payload.dailyTestSummaryData?.forEach(datum => {
      dateCheck(datum.date);
    });

    payload.hourlyOperatingData?.forEach(datum => {
      dateCheck(datum.date);
    });

    payload.sorbentTrapData?.forEach(datum => {
      dateCheck(datum.beginDate);
      dateCheck(datum.endDate);
    });

    payload.weeklyTestSummaryData?.forEach(datum => {
      dateCheck(datum.date);
    });

    const payloadCombo = Number(`${payload.year}${payload.quarter}`);
    if (payloadCombo < earliestDate || payloadCombo > latestDate) {
      return [CheckCatalogService.formatResultMessage('IMPORT-23-A')];
    }

    return [];
  }
}
