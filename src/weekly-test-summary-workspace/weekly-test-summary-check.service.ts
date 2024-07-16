import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { WeeklyTestSummaryImportDTO } from '../dto/weekly-test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { WeeklyTestSummaryWorkspaceRepository } from './weekly-test-summary.repository';
import { PlantRepository } from '../plant/plant.repository';
import { objectValuesByKey } from '../utils/utils';

@Injectable()
export class WeeklyTestSummaryCheckService {
  constructor(private readonly logger: Logger,
  private readonly wtsRepository: WeeklyTestSummaryWorkspaceRepository,
  private readonly plantRepository: PlantRepository,
  ) {
    this.logger.setContext('WeeklyTestSummaryCheckService');
  }

  runChecks(payload: EmissionsImportDTO): string[] {
    this.logger.log('Running Weekly Test Summary Checks');

    const errorList: string[] = [];

    payload?.weeklyTestSummaryData?.forEach(wts => {
      // import-38
      const error = this.inappropriateChildrenRecordsCheck(wts);

      errorList.push(error);
    });

    if (payload?.weeklyTestSummaryData?.length > 0) {
      const duplicateError = this.checkForDuplicateRecords(payload?.weeklyTestSummaryData[0].testTypeCode, payload);
      if (duplicateError) {
        errorList.push("duplicate Error");
      }
    } 

    this.logger.log('Completed Weekly Test Summary Checks');

    return errorList.filter(e => e !== null);
  }

  // import-38
  inappropriateChildrenRecordsCheck(
    summary: WeeklyTestSummaryImportDTO,
  ): string {
    if (summary) {
      if (
        summary.testTypeCode !== TestTypeCodes.HGSI1 &&
        summary.weeklySystemIntegrityData &&
        summary.weeklySystemIntegrityData.length > 0
      ) {
        return CheckCatalogService.formatResultMessage('IMPORT-38-A', {
          testTypeCode: summary.testTypeCode,
        });
      }
    }

    return null;
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

      const records = await this.wtsRepository.findByTestTypeCode(testTypeCode, monitoringLocationId);

      if (records) {
        return "Duplicate records found";
      }
    }

    return null;
  }
}
