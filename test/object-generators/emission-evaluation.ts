import { faker } from '@faker-js/faker';
import { ReportingPeriod } from '../../src/entities/reporting-period.entity';
import { genMonitorPlan, GenMonitorPlanConfig } from './monitor-plan';

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
      lastUpdated: faker.datatype.datetime(),
      updatedStatusFlg: faker.datatype.string(),
      needsEvalFlag: faker.datatype.string(),
      chkSessionId: faker.datatype.string(),
      submissionId: faker.datatype.number(),
      submissionAvailabilityCd: faker.datatype.string(),
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
