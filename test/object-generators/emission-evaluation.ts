import { faker } from '@faker-js/faker';
import { ReportingPeriod } from '../../src/entities/reporting-period.entity';
import { genMonitorPlan, GenMonitorPlanConfig } from './monitor-plan';
import { optionalValue } from './util';

type GenEmissionEvaluationConfig = {
  include?: Array<'reportingPeriod' | 'monitorPlan'>;
  monitorPlanConfig?: GenMonitorPlanConfig;
};

export const genEmissionEvaluation = <RepoType>(
  amount = 1,
  config?: GenEmissionEvaluationConfig,
): RepoType[] => {
  const emissions: RepoType[] = [];

  for (let emission = 0; emission < amount; emission++) {
    emissions.push(({
      monitorPlanId: faker.datatype.string(),
      reportingPeriodId: faker.datatype.number(),
      lastUpdated: optionalValue(faker.datatype.datetime()),
      updatedStatusFlg: optionalValue(faker.datatype.string()),
      needsEvalFlag: optionalValue(faker.datatype.string()),
      chkSessionId: optionalValue(faker.datatype.string()),
      submissionId: optionalValue(faker.datatype.number()),
      submissionAvailabilityCd: optionalValue(faker.datatype.string()),
      reportingPeriod:
        config?.include?.includes('reportingPeriod') === true
          ? new ReportingPeriod()
          : undefined,
      monitorPlan:
        config?.include?.includes('monitorPlan') === true
          ? genMonitorPlan(1, config?.monitorPlanConfig)[0]
          : undefined,
    } as unknown) as RepoType);
  }

  return emissions;
};
