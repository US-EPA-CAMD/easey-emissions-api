import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyTestSummaryRepository } from './daily-test-summary.repository';

@Injectable()
export class DailyTestSummaryService {
  constructor(
    private readonly map: DailyTestSummaryMap,
    private readonly repository: DailyTestSummaryRepository,
    private readonly configService: ConfigService,
  ) { }
}