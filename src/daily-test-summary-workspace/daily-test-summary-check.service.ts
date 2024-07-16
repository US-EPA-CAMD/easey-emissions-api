import { Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { DailyTestSummaryImportDTO } from '../dto/daily-test-summary.dto';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { DailyTestSummaryWorkspaceRepository } from './daily-test-summary.repository';
import { PlantRepository } from '../plant/plant.repository';
import { objectValuesByKey } from '../utils/utils';

@Injectable()
export class DailyTestSummaryCheckService {
  constructor(private readonly logger: Logger,
    private readonly dtsRepository: DailyTestSummaryWorkspaceRepository,
    private readonly plantRepository: PlantRepository,
  ) {
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

    if (payload?.dailyTestSummaryData?.length > 0) {
      const duplicateError = this.checkForDuplicateRecords(payload?.dailyTestSummaryData[0].testTypeCode, payload);
      if (duplicateError) {
        errorList.push("duplicate Error");
      }
    }
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

  async checkForDuplicateRecords(testTypeCode: string, payload: EmissionsImportDTO): Promise<string | null> {
    const stackPipeIds = objectValuesByKey<string>('stackPipeId', payload, true);
    const unitIds = objectValuesByKey<string>('unitId', payload, true);
    const plant = await this.plantRepository.getImportPlant({
      orisCode: payload.orisCode,
      stackIds: stackPipeIds,
      unitIds: unitIds,
    });

    const monitorPlans = plant?.monitorPlans;

    if (monitorPlans && monitorPlans.length > 0) {
      const monitoringLocationId = monitorPlans[0].locations[0].id;

      const records = await this.dtsRepository.findByTestTypeCode(testTypeCode, monitoringLocationId);

      if (records) {
        return "Duplicate records found";
      }
    }

    return null;
  }
}
