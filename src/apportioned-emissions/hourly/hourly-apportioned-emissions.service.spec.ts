import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { HourUnitDataView } from '../../entities/vw-hour-unit-data.entity';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { PaginatedHourlyApportionedEmissionsParamsDTO } from '../../dto/hourly-apportioned-emissions.params.dto';

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

describe('-- Hourly Apportioned Emissions Service --', () => {
  let service: HourlyApportionedEmissionsService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ConfigService,
        HourlyApportionedEmissionsService,
        {
          provide: HourUnitDataRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(HourlyApportionedEmissionsService);
    repository = module.get(HourUnitDataRepository);
  });

  describe('getEmissions', () => {
    it('calls HourUnitDataRepository.getEmissions() and gets all emissions from the repository', async () => {
      const expected = HourUnitDataView[0];
      repository.getEmissions.mockResolvedValue(expected);
      let filters = new PaginatedHourlyApportionedEmissionsParamsDTO();
      let result = await service.getEmissions(req, filters);
      expect(result).toEqual(expected);
    });
  });
});
