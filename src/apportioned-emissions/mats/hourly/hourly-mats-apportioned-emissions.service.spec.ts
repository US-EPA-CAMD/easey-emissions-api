import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Logger, LoggerModule } from '@us-epa-camd/easey-common/logger';

import { HourlyMatsApportionedEmissionsService } from './hourly-mats-apportioned-emissions.service';
import { HourUnitMatsDataView } from '../../../entities/vw-hour-unit-mats-data.entity';
import { PaginatedHourlyMatsApportionedEmissionsParamsDTO } from '../../../dto/hourly-mats-apporitioned-emissions.params.dto';
import { genHourUnitMatsDataView } from '../../../../test/object-generators/apportioned-emissions';

const mockRepository = {
  getEmissions: jest.fn(),
};

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

jest.mock('./hour-unit-mats-data.repository', () => ({
  HourUnitMatsDataRepository: jest.fn().mockImplementation(() => mockRepository),
}));

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
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              isReleased: false,
              manager: {},
            }),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
            setContext: jest.fn(),
          },
        }
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(HourlyMatsApportionedEmissionsService);
    repository = mockRepository;
  });

  describe('getEmissions', () => {
    it('calls HourUnitDataRepository.getEmissions() and gets all emissions from the repository', async () => {
      const expected = genHourUnitMatsDataView<HourUnitMatsDataView>();
      repository.getEmissions.mockResolvedValue(expected);
      let filters = new PaginatedHourlyMatsApportionedEmissionsParamsDTO();
      let result = await service.getEmissions(req, filters);
      expect(result).toEqual(expected);
    });
  });
});
