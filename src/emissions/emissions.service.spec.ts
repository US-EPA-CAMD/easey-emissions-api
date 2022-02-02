import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EmissionSubmissionsProgressMap } from '../maps/emissions-submission-progress.map';
import { EmissionsRepository } from './emissions.repository';
import { EmissionService } from './emissions.service';

let mockResolvedEmissionsRepository = undefined;

let configVals = {
  ['app.env']: 'development',
};

let repoVals = {};

describe('Emissions Service', () => {
  let service: EmissionService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        EmissionService,
        EmissionSubmissionsProgressMap,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return configVals[key];
            }),
          },
        },
        {
          provide: EmissionsRepository,
          useValue: {
            getSubmissionProgress: jest.fn(() => {
              return repoVals;
            }),
          },
        },
      ],
    }).compile();

    service = module.get(EmissionService);
  });

  it('should be defined', () => {
    expect(EmissionService).toBeDefined();
  });

  describe('getSubmissionProgress', () => {
    it('Given an undefined repo result, and a valid reporting month in quarter 4, return previous year and Fourth quarter', async () => {
      repoVals = undefined;

      const result = await service.getSubmissionProgress(
        new Date('2020-01-01'),
      );

      expect(result.year).toEqual(2019);
      expect(result.quarterName).toEqual('Fourth');
    });

    it('Given an undefined repo result, and a valid reporting month in quarter 1, return First quarter', async () => {
      repoVals = undefined;

      const result = await service.getSubmissionProgress(
        new Date('2020-04-01'),
      );

      expect(result.quarterName).toEqual('First');
    });

    it('Given an undefined repo result, and a valid reporting month in quarter 2, return Second quarter', async () => {
      repoVals = undefined;

      const result = await service.getSubmissionProgress(
        new Date('2020-07-01'),
      );

      expect(result.quarterName).toEqual('Second');
    });

    it('Given an undefined repo result, and a valid reporting month in quarter 3, return Third quarter', async () => {
      repoVals = undefined;

      const result = await service.getSubmissionProgress(
        new Date('2020-10-01'),
      );

      expect(result.quarterName).toEqual('Third');
    });

    it('Given an undefined repo result, and a non valid reporting month, return undefined', async () => {
      repoVals = undefined;

      const result = await service.getSubmissionProgress(
        new Date('2020-09-01'),
      );

      expect(result).toEqual(undefined);
    });

    it('Given an defined repo result, return the percentage', async () => {
      repoVals = { percentage: 100, quarter: 1, calendarYear: 2020 };

      const result = await service.getSubmissionProgress(
        new Date('2020-09-01'),
      );

      expect(result.quarterName).toEqual('First');
    });
  });
});
