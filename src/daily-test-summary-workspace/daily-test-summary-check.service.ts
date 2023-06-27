import { Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { DailyTestSummaryImportDTO } from '../dto/daily-test-summary.dto';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

@Injectable()
export class DailyTestSummaryCheckService {
  constructor(private readonly logger: Logger) {
    this.logger.setContext('DailyTestSummaryCheckService');
  }

  runChecks(payload: EmissionsImportDTO): string[] {
    this.logger.log('Running Daily Test Summary Checks');

    const errorList: string[] = [];

    payload?.dailyTestSummaryData?.forEach(dts => {
      // import-29
      const error = this.inappropriateChildrenRecordsCheck(dts);

      errorList.push(error);
    });

    this.logger.log('Completed Daily Test Summary Checks');

    return errorList.filter(e => e !== null);
  }

  // import-29
  inappropriateChildrenRecordsCheck(
    summary: DailyTestSummaryImportDTO,
  ): string {
    return summary?.testTypeCode !== TestTypeCodes.DAYCAL &&
      summary?.dailyCalibrationData?.length > 0
      ? CheckCatalogService.formatResultMessage('IMPORT-29-A')
      : null;
  }
}
