import { Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { DailyTestSummaryImportDTO } from '../dto/daily-test-summary.dto';
import { IMPORT_CHECK_ERROR } from '../utils/error.const';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';

@Injectable()
export class DailyTestSummaryCheckService {
  constructor(private readonly logger: Logger) {}

  runChecks(payload: EmissionsImportDTO): string[] {
    this.logger.info('Running Daily Test Summary Checks');

    const errorList: string[] = [];

    payload?.dailyTestSummaryData.forEach(dts => {
      // import-29
      let error = this.inappropriateChildrenRecordsCheck(dts);

      errorList.push(error);
    });

    this.logger.info('Completed Daily Test Summary Checks');

    return errorList.filter(e => e !== null);
  }

  // import-29
  inappropriateChildrenRecordsCheck(
    summary: DailyTestSummaryImportDTO,
  ): string {
    return (
        summary?.testTypeCode !== TestTypeCodes.DAYCAL &&
        summary?.dailyCalibrationData?.length > 0
    )
      ? IMPORT_CHECK_ERROR.IMPORT_29.RESULT_A(): null;
  }
}
