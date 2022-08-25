import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { EmissionsDTO } from '../dto/emissions.dto';
import { EmissionEvaluation } from '../entities/emission-evaluation.entity';

@Injectable()
export class EmissionsMap extends BaseMap<EmissionEvaluation, EmissionsDTO> {
  public async one(entity: EmissionEvaluation): Promise<EmissionsDTO> {
    return {
      orisCode: entity.monitorPlan?.plant?.orisCode,
      monitorPlanId: entity.monitorPlanId,
      reportingPeriodId: entity.reportingPeriodId,
      year: entity.reportingPeriod?.year,
      quarter: entity.reportingPeriod?.quarter,
      submissionComment: null,
      lastUpdated: entity.lastUpdated,
      updatedStatusFlg: entity.updatedStatusFlg,
      needsEvalFlag: entity.needsEvalFlag,
      chkSessionId: entity.chkSessionId,
      submissionId: entity.submissionId,
      submissionAvailabilityCd: entity.submissionAvailabilityCd,
      dailyEmissionData: null,
      weeklyTestSummaryData: null,
      summaryValueData: null,
      dailyTestSummaryData: null,
      hourlyOperatingData: null,
      longTermFuelFlowData: null,
      sorbentTrapData: null,
      nsps4tSummaryData: null,
    };
  }
}
