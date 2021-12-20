import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { getManager } from 'typeorm';
import { EmissionSubmissionsProgressMap } from '../maps/emissions-submission-progress.map';
import { EmissionService } from './emissions.service';

describe('Emissions Service', () => {
  let service: EmissionService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        EmissionService,
        EmissionSubmissionsProgressMap
      ],
    }).compile();

    service = module.get(EmissionService);
  });

  it('should be defined', () => {
    expect(EmissionService).toBeDefined();
  });

  describe('getSubmissionProgress', () => {

    it('should return the provided data given a valid time period', async () => {

      jest.spyOn(service, 'executeSubmissionProgressQuery').mockResolvedValue(
        {
          beginDate: "2021-07-01T04:00:00.000Z",
          endDate: "2021-09-30T04:00:00.000Z",
          calendarYear: "2021",
          quarter: "3",
          submittedPercentage: "98.00000000000000000000",
          submittedCount: "3724",
          remainingCount: "76",
          totalExpectedCount: "3800",
          gdmUsedPercentage: "0.07894736842105263200",
          gdmUsedCount: "3",
          gdmRemainingCount: "3797"
        }
      );

      const result = await service.getSubmissionProgress('2021-10-01');

      expect(result.remainingCount).toEqual('76');
    });

    it('should return undefined given no existing data', async () => {

      jest.spyOn(service, 'executeSubmissionProgressQuery').mockResolvedValue(
       undefined
      );

      const result = await service.getSubmissionProgress('');

      expect(result).toEqual(undefined);
    });

    
  });

});
