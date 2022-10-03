import { Nsps4tCompliancePeriodWorkspaceRepository } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.repository';

describe('ImportNsps4tCompliancePeriodData', () => {
  let repository: Nsps4tCompliancePeriodWorkspaceRepository;
  let importNsps4tCompliancePeriodModule: typeof import('./import-nsps4t-compliance-period-data');

  beforeAll(async () => {
    repository = new Nsps4tCompliancePeriodWorkspaceRepository();
    importNsps4tCompliancePeriodModule = await import(
      './import-nsps4t-compliance-period-data'
    );
  });

  it('should import data', async function() {
    const importReturns = [];
  });
});
