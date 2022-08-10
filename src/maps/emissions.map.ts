import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { EmissionsDTO } from '../dto/emissions.dto';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { EmissionEvaluation } from '../entities/emission-evaluation.entity';

@Injectable()
export class EmissionsMap extends BaseMap<EmissionEvaluation, EmissionsDTO> {

  constructor(
    private readonly dailyTestSummaryMap: DailyTestSummaryMap
  ) {
    super();
  }

  public async one(entity: EmissionEvaluation): Promise<EmissionsDTO> {
    const dailyEmissions = [];
    const weeklyTestSummaries = [];
    const summaryValues = [];
    const dailyTestSummaries = [];
    const hourlyOperating = [];
    const longTermFuelFlows = [];
    const sorbentTraps = [];
    const nsps4tSummaries = [];

    entity.plan.locations.forEach(l => {
      if (l.dailyEmissions && l.dailyEmissions.length > 0) {
        dailyEmissions.push(...l.dailyEmissions);
      }
      if (l.weeklyTestSummaries && l.weeklyTestSummaries.length > 0) {      
        weeklyTestSummaries.push(...l.weeklyTestSummaries);
      }
      if (l.summaryValues && l.summaryValues.length > 0) {
        summaryValues.push(...l.summaryValues);
      }
      if (l.dailyTestSummaries && l.dailyTestSummaries.length > 0) {
        dailyTestSummaries.push(...l.dailyTestSummaries);
      }
      if (l.hrlyOpData && l.hrlyOpData.length > 0) {
        hourlyOperating.push(...l.hrlyOpData);
      }
      if (l.longTermFuelFlows && l.longTermFuelFlows.length > 0) {
        longTermFuelFlows.push(...l.longTermFuelFlows);
      }
      if (l.sorbentTraps && l.sorbentTraps.length > 0) {
        sorbentTraps.push(...l.sorbentTraps);
      }
      if (l.nsps4tSummaries && l.nsps4tSummaries.length > 0) {
        nsps4tSummaries.push(...l.nsps4tSummaries);
      }
    });

    const dailyEmissionData = dailyEmissions && dailyEmissions.length > 0
      ? null//await this.dailyEmissionMap.many(dailyEmissions)
      : [];

    const weeklyTestSummaryData = weeklyTestSummaries && weeklyTestSummaries.length > 0
      ? null//await this.weeklyTestSummaryMap.many(weeklyTestSummaries)
      : [];

    const summaryValueData = summaryValues && summaryValues.length > 0
      ? null//await this.summaryValueMap.many(summaryValues)
      : [];

    const dailyTestSummaryData = dailyTestSummaries && dailyTestSummaries.length > 0
      ? await this.dailyTestSummaryMap.many(dailyTestSummaries)
      : [];

    const hourlyOperatingData = hourlyOperating && hourlyOperating.length > 0
      ? null//await this.hourlyOperatingMap.many(hourlyOperating)
      : [];

    const longTermFuelFlowData = longTermFuelFlows && longTermFuelFlows.length > 0
      ? null//await this.longTermFuelFlowMap.many(longTermFuelFlows)
      : [];

    const sorbentTrapData = sorbentTraps && sorbentTraps.length > 0
      ? null//await this.sorbentTrapMap.many(sorbentTraps)
      : [];

    const nsps4tSummaryData = nsps4tSummaries && nsps4tSummaries.length > 0
      ? null//await this.nsps4tSummarieMap.many(nsps4tSummaries)
      : [];

    return {
      orisCode: entity.plan.plant.orisCode,
      monPlanId: entity.monPlanId,
      reportingPeriodId: entity.reportingPeriodId,
      year: entity.reportingPeriod.year,
      quarter: entity.reportingPeriod.quarter,
      submissionComment: null,
      lastUpdate: entity.lastUpdated,
      updatedStatusFlg: entity .updatedStatusFlg,
      needsEvalFlag: entity.needsEvalFlag,
      chkSessionId: null,
      submissionId: null,
      submissionAvailabilityCd: null,
      dailyEmissionData,
      weeklyTestSummaryData,
      summaryValueData,
      dailyTestSummaryData,
      hourlyOperatingData,
      longTermFuelFlowData,
      sorbentTrapData,
      nsps4tSummaryData,
    };
  }
}
