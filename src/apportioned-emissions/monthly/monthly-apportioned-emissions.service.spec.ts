import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonthUnitDataView } from '../../entities/vw-month-unit-data.entity';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';

import {
  MonthlyApportionedEmissionsParamsDTO,
  PaginatedMonthlyApportionedEmissionsParamsDTO,
} from '../../dto/monthly-apportioned-emissions.params.dto';
import { StreamService } from '@us-epa-camd/easey-common/stream';
import { ConfigService } from '@nestjs/config';

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

const mockRepository = () => ({
  getEmissions: jest.fn(),
  getStreamQuery: jest.fn(),
  getEmissionsFacilityAggregation: jest.fn(),
  getFacilityStreamQuery: jest.fn(),
  getEmissionsStateAggregation: jest.fn(),
  getStateStreamQuery: jest.fn(),
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

const mockStream = {
  pipe: jest.fn().mockReturnValue({
    pipe: jest.fn().mockReturnValue(Buffer.from('stream')),
  }),
};

describe('-- Monthly Apportioned Emissions Service --', () => {
  let service: MonthlyApportionedEmissionsService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        {
          provide: StreamService,
          useFactory: () => ({
            getStream: () => {
              return mockStream;
            },
          }),
        },
        ConfigService,
        MonthlyApportionedEmissionsService,
        {
          provide: MonthUnitDataRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(MonthlyApportionedEmissionsService);
    repository = module.get(MonthUnitDataRepository);
  });

  describe('getEmissions', () => {
    it('calls MonthUnitDataRepository.getEmissions() and gets all emissions from the repository', async () => {
      const expected = MonthUnitDataView[0];
      repository.getEmissions.mockResolvedValue(expected);
      let filters = new PaginatedMonthlyApportionedEmissionsParamsDTO();
      let result = await service.getEmissions(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('streamEmissions', () => {
    it('calls MonthlyUnitDataRepository.streamEmissions() and streams all emissions from the repository', async () => {
      repository.getStreamQuery.mockResolvedValue('');

      let filters = new MonthlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissions(req, filters);

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream'), {
          type: req.headers.accept,
          disposition: `attachment; filename="monthly-emissions-${0}.json"`,
        }),
      );
    });
  });

  describe('getEmissionsFacilityAggregation', () => {
    it('calls MonthUnitDataRepository.getEmissionsFacilityAggregation() and gets all emissions from the repository', async () => {
      const expected = [{ month: 1 }];
      repository.getEmissionsFacilityAggregation.mockResolvedValue(expected);
      let filters = new PaginatedMonthlyApportionedEmissionsParamsDTO();
      let result = await service.getEmissionsFacilityAggregation(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('streamEmissionsFacilityAggregation', () => {
    it('calls MonthUnitDataRepository.getFacilityStreamQuery() and streams all emissions from the repository', async () => {
      repository.getFacilityStreamQuery.mockResolvedValue('');

      let filters = new MonthlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsFacilityAggregation(
        req,
        filters,
      );

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream'), {
          type: req.headers.accept,
          disposition: `attachment; filename="monthly-emissions-facility-aggregation-${0}.json"`,
        }),
      );
    });
  });

  describe('getEmissionsStateAggregation', () => {
    it('calls MonthUnitDataRepository.getEmissionsStateAggregation() and gets all emissions from the repository', async () => {
      const expected = [{ month: 1 }];
      repository.getEmissionsStateAggregation.mockResolvedValue(expected);
      let filters = new PaginatedMonthlyApportionedEmissionsParamsDTO();
      let result = await service.getEmissionsStateAggregation(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('streamEmissionsStateAggregation', () => {
    it('calls MonthUnitDataRepository.getStateStreamQuery() and streams all emissions from the repository', async () => {
      repository.getStateStreamQuery.mockResolvedValue('');

      let filters = new MonthlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsStateAggregation(req, filters);

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream'), {
          type: req.headers.accept,
          disposition: `attachment; filename="monthly-emissions-state-aggregation-${0}.json"`,
        }),
      );
    });
  });
});
