import { HttpStatus, Injectable } from '@nestjs/common';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { CheckCatalogService } from 'src/check-catalog/check-catalog.service';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { WeeklyTestSummaryCheckService } from '../weekly-test-summary-workspace/weekly-test-summary-check.service';

@Injectable()
export class EmissionsChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly weeklyTestSummaryCheckService: WeeklyTestSummaryCheckService,
  ) {}
  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  runChecks(payload: EmissionsImportDTO): string[] {
    this.logger.info('Running Emissions Import Checks');

    const errorList: string[] = [];
    const weeklyTestSummaryCheckErrors = this.weeklyTestSummaryCheckService.runChecks(
      payload,
    );
    const invalidDatesCheckErrors = this.invalidDatesCheck(payload);

    errorList.push(...weeklyTestSummaryCheckErrors, ...invalidDatesCheckErrors);

    this.throwIfErrors(errorList);
    this.logger.info('Completed Emissions Import Checks');

    return errorList;
  }

  // IMPORT-23
  invalidDatesCheck(payload: EmissionsImportDTO): string[] {
    let earliestDate: number;
    let latestDate: number;

    const dateCheck = (date: Date) => {
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
    });

    payload.sorbentTrapData?.forEach(datum => {
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
