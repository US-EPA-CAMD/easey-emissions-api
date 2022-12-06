import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { HourlyMatsApportionedEmissionsService } from './hourly-mats-apportioned-emissions.service';
import { HourUnitMatsDataRepository } from './hour-unit-mats-data.repository';
import { HourUnitMatsDataView } from '../../../entities/vw-hour-unit-mats-data.entity';
import { PaginatedHourlyMatsApportionedEmissionsParamsDTO } from '../../../dto/hourly-mats-apporitioned-emissions.params.dto';
import { genHourUnitMatsDataView } from '../../../../test/object-generators/apportioned-emissions';

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

describe('-- Hourly MATS Apportioned Emissions Service --', () => {
  let service: HourlyMatsApportionedEmissionsService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ConfigService,
        HourlyMatsApportionedEmissionsService,
        {
          provide: HourUnitMatsDataRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(HourlyMatsApportionedEmissionsService);
    repository = module.get(HourUnitMatsDataRepository);
  });

  describe('getEmissions', () => {
    it('calls HourUnitDataRepository.getEmissions() and gets all emissions from the repository', async () => {
      const expected = genHourUnitMatsDataView<HourUnitMatsDataView>(); ;
      repository.getEmissions.mockResolvedValue(expected);
      let filters = new PaginatedHourlyMatsApportionedEmissionsParamsDTO();
      let result = await service.getEmissions(req, filters);
      expect(result).toEqual(expected);
    });
  });
});
