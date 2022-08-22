import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
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

  runChecks(payload: EmissionsImportDTO)  {
    this.logger.info('Running Emissions Import Checks');

    const errorList: string[] = [];
    const weeklyTestSummaryCheckErrors = this.weeklyTestSummaryCheckService.runChecks(payload);

    errorList.push(...weeklyTestSummaryCheckErrors);

    this.throwIfErrors(errorList);
    this.logger.info('Completed Emissions Import Checks');

    return errorList;
  }
}
