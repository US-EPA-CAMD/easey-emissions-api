import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EmissionsSubmissionsProgressRepository } from './emissions-submissions-progress.repository';
import { EmissionsSubmissionsProgress } from '../entities/vw-emissions-submissions-progress.entity';
import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { EmissionsSubmissionsProgressDTO } from '../dto/emissions-submissions-progress.dto';
import { EmissionsRepository } from './emissions.repository';
import { EmissionsMap } from '../maps/emissions.map';
import { EmissionsDTO, EmissionsImportDTO } from '../dto/emissions.dto';
import { DailyTestSummaryService } from '../daily-test-summary/daily-test-summary.service';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { HourlyOperatingService } from '../hourly-operating/hourly-operating.service';
import { DailyEmissionService } from '../daily-emission/daily-emission.service';
import { SorbentTrapService } from '../sorbent-trap/sorbent-trap.service';
import { WeeklyTestSummaryService } from '../weekly-test-summary/weekly-test-summary.service';
import { SummaryValueService } from '../summary-value/summary-value.service';
import { Nsps4tSummaryService } from '../nsps4t-summary/nsps4t-summary.service';
import { LongTermFuelFlowService } from '../long-term-fuel-flow/long-term-fuel-flow.service';
import { removeNonReportedValues } from '../utils/remove-non-reported-values';
import { DailyBackstopService } from '../daily-backstop/daily-backstop.service';
import { EaseyContentService } from '../emissions-easey-content/easey-content.service';

const moment = require('moment');

@Injectable()
export class EmissionsService {
  constructor(
    private readonly map: EmissionsMap,
    private readonly repository: EmissionsRepository,
    private readonly submissionProgressMap: EmissionsSubmissionsProgressMap,
    private readonly submissionProgressRepo: EmissionsSubmissionsProgressRepository,
    private readonly configService: ConfigService,
    private readonly dailyTestSummaryService: DailyTestSummaryService,
    private readonly hourlyOperatingService: HourlyOperatingService,
    private readonly weeklyTestSummaryService: WeeklyTestSummaryService,
    private readonly dailyEmissionService: DailyEmissionService,
    private readonly sorbentTrapService: SorbentTrapService,
    private readonly summaryValueService: SummaryValueService,
    private readonly nsps4tSummaryService: Nsps4tSummaryService,
    private readonly longTermFuelFlowService: LongTermFuelFlowService,
    private readonly dailyBackstopService: DailyBackstopService,
    private readonly easeyContentService: EaseyContentService,
  ) {}

  async export(
    params: EmissionsParamsDTO,
    rptValuesOnly: boolean = false,
  ): Promise<EmissionsDTO | EmissionsImportDTO> {
    const promises = [];
    const DAILY_TEST_SUMMARIES = 0;
    const HOURLY_OPERATING = 1;
    const DAILY_EMISSION = 2;
    const SORBENT_TRAP = 3;
    const WEEKLY_TEST_SUMMARIES = 4;
    const SUMMARY_VALUES = 5;
    const NSPS4T_SUMMARY = 6;
    const LONG_TERM_FUEL_FLOW = 7;
    const DAILY_BACKSTOP = 8;

    const emissions = await this.repository.export(
      params.monitorPlanId,
      params.year,
      params.quarter,
    );

    if (emissions && Array.isArray(emissions.monitorPlan?.locations)) {
      const locationIds = emissions.monitorPlan?.locations?.map(s => s.id);

      promises.push(this.dailyTestSummaryService.export(locationIds, params));
      promises.push(this.hourlyOperatingService.export(locationIds, params));
      promises.push(this.dailyEmissionService.export(locationIds, params));
      promises.push(this.sorbentTrapService.export(locationIds, params));
      promises.push(this.weeklyTestSummaryService.export(locationIds, params));
      promises.push(this.summaryValueService.export(locationIds, params));
      promises.push(this.nsps4tSummaryService.export(locationIds, params));
      promises.push(this.longTermFuelFlowService.export(locationIds, params));
      promises.push(this.dailyBackstopService.export(locationIds, params));

      const promiseResult = await Promise.all(promises);
      const version = this.easeyContentService.emissionsSchema?.version;
      const results = {version, ...await this.map.one(emissions)};
      results.dailyTestSummaryData = promiseResult[DAILY_TEST_SUMMARIES] ?? [];
      results.hourlyOperatingData = promiseResult[HOURLY_OPERATING] ?? [];
      results.dailyEmissionData = promiseResult[DAILY_EMISSION] ?? [];
      results.sorbentTrapData = promiseResult[SORBENT_TRAP] ?? [];
      results.weeklyTestSummaryData =
        promiseResult[WEEKLY_TEST_SUMMARIES] ?? [];
      results.summaryValueData = promiseResult[SUMMARY_VALUES] ?? [];
      results.nsps4tSummaryData = promiseResult[NSPS4T_SUMMARY] ?? [];
      results.longTermFuelFlowData = promiseResult[LONG_TERM_FUEL_FLOW] ?? [];
      results.dailyBackstopData = promiseResult[DAILY_BACKSTOP] ?? [];

      if (rptValuesOnly) {
        await removeNonReportedValues(results);
      }

      return results;
    }

    return new EmissionsDTO();
  }

  async getSubmissionProgress(
    periodDate: Date,
  ): Promise<EmissionsSubmissionsProgressDTO> {
    let queryResult = await this.submissionProgressRepo.getSubmissionProgress(
      periodDate,
      this.configService.get<number>('app.submissionDays'),
    );

    const date = moment(periodDate);
    const month = date.get('month') + 1;

    if (!queryResult) {
      if (
        ['development', 'test', 'local-dev'].includes(
          this.configService.get<string>('app.env'),
        ) &&
        ([1, 4, 7, 10].includes(month) ||
          ([2, 5, 8, 11].includes(month) && date.get('date') <= 7))
      ) {
        queryResult = new EmissionsSubmissionsProgress();

        let year = date.get('year');
        if (month >= 1 && month <= 3) {
          queryResult.quarter = 4;
          year--;
        } else if (month >= 4 && month <= 6) {
          queryResult.quarter = 1;
        } else if (month >= 7 && month <= 9) {
          queryResult.quarter = 2;
        } else {
          queryResult.quarter = 3;
        }
        queryResult.calendarYear = year;
        queryResult.submittedPercentage = Math.floor(Math.random() * 100);
      } else {
        return undefined;
      }
    }
    return this.submissionProgressMap.one(queryResult);
  }
}
