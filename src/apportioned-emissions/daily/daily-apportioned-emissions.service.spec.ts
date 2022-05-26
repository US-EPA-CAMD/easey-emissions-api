import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { DayUnitDataView } from '../../entities/vw-day-unit-data.entity';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';
import { PaginatedDailyApportionedEmissionsParamsDTO } from '../../dto/daily-apportioned-emissions.params.dto';

const mockRepository = () => ({
  getEmissions: jest.fn(),
});

const mockRequest = () => {
  return {
    headers: {
      accept: '',
    },
    res: {
      setHeader: jest.fn(),
    },
    on: jest.fn(),
  };
};

describe('-- Daily Apportioned Emissions Service --', () => {
  let service: DailyApportionedEmissionsService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ConfigService,
        DailyApportionedEmissionsService,
        {
          provide: DayUnitDataRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(DailyApportionedEmissionsService);
    repository = module.get(DayUnitDataRepository);
  });

  describe('getEmissions', () => {
    it('calls DayUnitDataRepository.getEmissions() and gets all emissions from the repository', async () => {
      const expected = DayUnitDataView[0];
      repository.getEmissions.mockResolvedValue(expected);
      let filters = new PaginatedDailyApportionedEmissionsParamsDTO();
      let result = await service.getEmissions(req, filters);
      expect(result).toEqual(expected);
    });
  });
});
