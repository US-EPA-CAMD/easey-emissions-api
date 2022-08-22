import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { WeeklyTestSummaryCheckService } from '../weekly-test-summary-workspace/weekly-test-summary-check.service';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsChecksService } from './emissions-checks.service';

describe('Emissions Checks Service Tests', () => {
  let service: EmissionsChecksService;
  let wtsChecksService: WeeklyTestSummaryCheckService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        EmissionsChecksService,
        {
          provide: WeeklyTestSummaryCheckService,
          useFactory: () => ({
            runChecks: jest.fn().mockReturnValue([]),
          }),
        },
      ],
    }).compile();

    service = module.get(EmissionsChecksService);
  });

  describe('test runChecks()', () => {
    it('should run successfully', () => {
      const emissionsPayload = new EmissionsImportDTO();
      const result = service.runChecks(emissionsPayload);

      expect(typeof result).not.toBeNull();
    });
  });
});
