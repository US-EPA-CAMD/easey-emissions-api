import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { EarliestPartitionQuarterChecksService } from './earliest-partition-quarter-checks.service';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { genEmissionsImportDto } from '../../test/object-generators/emissions-dto';
import { ReportingPeriod } from '../entities/reporting-period.entity';
import { EarliestPartitionQuarter } from '../entities/earliest-partition-quarter.entity';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

jest.mock('@us-epa-camd/easey-common/check-catalog', () => ({
  CheckCatalogService: {
    formatResultMessage: jest.fn().mockReturnValue('mock-error-message'),
  },
}));

describe('EarliestPartitionQuarterChecksService', () => {
  let service: EarliestPartitionQuarterChecksService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [EarliestPartitionQuarterChecksService, EntityManager],
    }).compile();

    service = module.get(EarliestPartitionQuarterChecksService);
    entityManager = module.get(EntityManager);
  });

  it('should run checks and return errors for quarters earlier than the earliest partition', async () => {

    const payload = genEmissionsImportDto(1, {
      include: [
        'dailyBackstopData',
        'weeklyTestSummaryData',
        'hourlyOperatingData',
      ],
    })[0] as EmissionsImportDTO;

    jest.spyOn(entityManager, 'findOneBy').mockImplementation((entity, criteria) => {
        
        if (entity === ReportingPeriod) {
          const reportingPeriod = new ReportingPeriod();
          reportingPeriod.id = 10;
          reportingPeriod.periodAbbreviation = '2022 Q1';
          return Promise.resolve(reportingPeriod);
        }

        if (entity === EarliestPartitionQuarter) {
          const epq = new EarliestPartitionQuarter();
          const reportingPeriod = new ReportingPeriod();
          reportingPeriod.periodAbbreviation = '2023 Q1';

          if (criteria['tableName'] === 'DAILY_BACKSTOP') {
            epq.reportingPeriodId = 100;
            epq.reportingPeriod = reportingPeriod;
            return Promise.resolve(epq);
          }

          if (criteria['tableName'] === 'WEEKLY_TEST_SUMMARY') {
            epq.reportingPeriodId = 100;
            epq.reportingPeriod = reportingPeriod;
            return Promise.resolve(epq);
          }

          if (criteria['tableName'] === 'WEEKLY_SYSTEM_INTEGRITY') {
            epq.reportingPeriodId = 100;
            epq.reportingPeriod = reportingPeriod;
            return Promise.resolve(epq);
          }
        }

        return Promise.resolve(null);
      },
    );

    const errors = await service.runChecks(payload);

    expect(errors).toHaveLength(3);
    expect(CheckCatalogService.formatResultMessage).toHaveBeenCalledTimes(3);
  });
});