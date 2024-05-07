import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { genNsps4tCompliancePeriod } from '../../test/object-generators/nsps4t-compliance-period';
import { Nsps4tCompliancePeriod } from '../entities/nsps4t-compliance-period.entity';
import { Nsps4tCompliancePeriodMap } from '../maps/nsps4t-compliance-period.map';
import { Nsps4tCompliancePeriodRepository } from '../nsps4t-compliance-period/nsps4t-compliance-period.repository';

describe('ExportNsps4tCompliancePeriodData', () => {
  let nsps4tCompliancePeriodRepository: Nsps4tCompliancePeriodRepository;
  let exportNsps4tCompliancePeriodModule: typeof import('./export-nsps4t-compliance-period-data');

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityManager, Nsps4tCompliancePeriodRepository],
    }).compile();

    nsps4tCompliancePeriodRepository = module.get(
      Nsps4tCompliancePeriodRepository,
    );
    exportNsps4tCompliancePeriodModule = await import(
      './export-nsps4t-compliance-period-data'
    );
  });

  it('should export records', async function() {
    const nsps4tSummaryIds = faker.helpers.uniqueArray(
      faker.datatype.string,
      3,
    );
    const nsps4tCompliancePeriodMocks = genNsps4tCompliancePeriod<
      Nsps4tCompliancePeriod
    >(3);
    const mappedNsps4tCompliancePeriods = await new Nsps4tCompliancePeriodMap().many(
      nsps4tCompliancePeriodMocks,
    );

    jest
      .spyOn(
        exportNsps4tCompliancePeriodModule,
        'exportNsps4tCompliancePeriodQuery',
      )
      .mockResolvedValue(nsps4tCompliancePeriodMocks);

    await expect(
      exportNsps4tCompliancePeriodModule.exportNps4tCompliancePeriodData({
        nsps4tSummaryIds,
        repository: nsps4tCompliancePeriodRepository,
      }),
    ).resolves.toEqual(mappedNsps4tCompliancePeriods);
  });
});
