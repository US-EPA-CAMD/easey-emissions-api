import { Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { WeeklyTestSummaryImportDTO } from '../dto/weekly-test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';

@Injectable()
export class WeeklyTestSummaryCheckService {
  constructor(private readonly logger: Logger) {}

  runChecks(payload: EmissionsImportDTO): string[] {
    this.logger.info('Running Weekly Test Summary Checks');

    const errorList: string[] = [];

    payload.weeklyTestSummaryData?.forEach(wts => {
      // import-38
      let error = this.inappropriateChildrenRecordsCheck(wts);

      errorList.push(error);
    });

    this.logger.info('Completed Weekly Test Summary Checks');

    return errorList.filter(e => e !== null);
  }

  // import-38
  inappropriateChildrenRecordsCheck(
    summary: WeeklyTestSummaryImportDTO,
  ): string {
    return (
        summary?.testTypeCode !== TestTypeCodes.HGSI1 &&
        summary?.weeklySystemIntegrityData?.length > 0
    )
      ? `You have reported WeeklySystemIntegrity records for a Weekly Test Summary Record with a Test Type Code of [${summary.testTypeCode}]. This File was not imported.`
      : null;
  }
}
