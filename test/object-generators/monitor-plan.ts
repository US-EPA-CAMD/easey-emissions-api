import { faker } from '@faker-js/faker';
import { genPlant } from './plant';
import { genMonitorLocation } from './monitor-location';
import { genEmissionEvaluation } from './emission-evaluation';
import { genReportingPeriod } from './reporting-period';

export type GenMonitorPlanConfig = {
  include?: Array<
    | 'beginRptPeriod'
    | 'endRptPeriod'
    | 'plant'
    | 'locations'
    | 'emissionsEvaluations'
  >;
  emissionEvaluationAmount?: number;
  monitorLocationAmount?: number;
};

export const genMonitorPlan = (amount = 1, config?: GenMonitorPlanConfig) => {
  const plans = [];

  for (let plan = 0; plan < amount; plan++) {
    plans.push({
      id: faker.datatype.string(),
      facilityId: faker.datatype.number(),
      beginRptPeriod: config?.include?.includes('beginRptPeriod')
        ? genReportingPeriod()
        : undefined,
      endRptPeriod: config?.include?.includes('endRptPeriod')
        ? genReportingPeriod()
        : undefined,
      plant: config?.include?.includes('plant') ? genPlant()[0] : undefined,
      locations: config?.include?.includes('locations')
        ? genMonitorLocation(config?.monitorLocationAmount)
        : undefined,
      emissionsEvaluations: config?.include?.includes('emissionsEvaluations')
        ? genEmissionEvaluation(config?.emissionEvaluationAmount)
        : undefined,
    });
  }

  return plans;
};
