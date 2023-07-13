import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { EmissionsDTO } from '../dto/emissions.dto';
import { EmissionEvaluation } from '../entities/emission-evaluation.entity';
import { EmissionEvaluation as EmissionEvaluationWorkspace } from '../entities/workspace/emission-evaluation.entity';

@Injectable()
export class EmissionsMap extends BaseMap<
  EmissionEvaluation | EmissionEvaluationWorkspace,
  EmissionsDTO
> {
  public async one(
    entity: EmissionEvaluation | EmissionEvaluationWorkspace,
  ): Promise<EmissionsDTO> {
    return {
      orisCode: entity.monitorPlan?.plant?.orisCode,
      monitorPlanId: entity.monitorPlanId,
      reportingPeriodId: entity.reportingPeriodId,
      year: entity.reportingPeriod?.year,
      quarter: entity.reportingPeriod?.quarter,
      submissionComment: null,
      lastUpdated: entity.lastUpdated?.toISOString() ?? null,
      updatedStatusFlg: entity.updatedStatusFlg,
      needsEvalFlag: entity.needsEvalFlag,
      chkSessionId: entity.chkSessionId,
      submissionId: entity.submissionId,
      submissionAvailabilityCd: entity.submissionAvailabilityCd,
      dailyEmissionData: [],
      weeklyTestSummaryData: [],
      summaryValueData: [],
      dailyTestSummaryData: [],
      hourlyOperatingData: [],
      longTermFuelFlowData: [],
      sorbentTrapData: [],
      nsps4tSummaryData: [],
      dailyBackstopData: [],
    };
  }
}
