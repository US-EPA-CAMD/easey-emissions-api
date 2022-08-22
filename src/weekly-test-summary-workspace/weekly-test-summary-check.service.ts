import { Injectable } from '@nestjs/common';
import { EmissionsImportDTO } from 'src/dto/emissions.dto';
import { WeeklyTestSummaryImportDTO } from 'src/dto/weekly-test-summary.dto';
import { TestTypeCodes } from 'src/enums/test-type-code.enum';

@Injectable()
export class WeeklyTestSummaryCheckService {
  constructor() {}

  runChecks(payload: EmissionsImportDTO): string[] {
    const errorList: string[] = [];

    payload.weeklyTestSummaryData.forEach(wts => {

        // import-38
        let error = this.inappropriateChildrenRecordsCheck(wts);

        errorList.push(error);
    });

    return errorList;
  }

  // import-38
  private inappropriateChildrenRecordsCheck(
    summary: WeeklyTestSummaryImportDTO,
  ): string {
    if (
      summary.testTypeCode === TestTypeCodes.HGSI1 &&
      summary?.weeklySystemIntegrityData.length > 0
    )
      return `You have reported WeeklySystemIntegrity records for a Weekly Test Summary Record with a Test Type Code of [${TestTypeCodes.HGSI1}]. This File was not imported.`;
    else 
        return null;
  }
}
