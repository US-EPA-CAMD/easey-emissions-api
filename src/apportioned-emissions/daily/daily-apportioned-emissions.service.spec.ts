import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { DayUnitDataView } from '../../entities/vw-day-unit-data.entity';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';

import {
  DailyApportionedEmissionsParamsDTO,
  PaginatedDailyApportionedEmissionsParamsDTO,
} from '../../dto/daily-apportioned-emissions.params.dto';
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
  getEmissionsNationalAggregation: jest.fn(),
  getNationalStreamQuery: jest.fn(),
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

describe('-- Daily Apportioned Emissions Service --', () => {
  let service: DailyApportionedEmissionsService;
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

  describe('streamEmissions', () => {
    it('calls DailyUnitDataRepository.streamEmissions() and streams all emissions from the repository', async () => {
      repository.getStreamQuery.mockResolvedValue('');

      let filters = new DailyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissions(req, filters);

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream'), {
          type: req.headers.accept,
          disposition: `attachment; filename="daily-emissions-${0}.json"`,
        }),
      );
    });
  });

  describe('getEmissionsFacilityAggregation', () => {
    it('calls DayUnitDataRepository.getEmissionsFacilityAggregation() and gets all emissions from the repository', async () => {
      const expected = [{ date: '2019-01-01' }];
      repository.getEmissionsFacilityAggregation.mockResolvedValue(expected);
      let filters = new PaginatedDailyApportionedEmissionsParamsDTO();
      let result = await service.getEmissionsFacilityAggregation(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('streamEmissionsFacilityAggregation', () => {
    it('calls DailyUnitDataRepository.getFacilityStreamQuery() and streams all emissions from the repository', async () => {
      repository.getFacilityStreamQuery.mockResolvedValue('');

      let filters = new DailyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsFacilityAggregation(
        req,
        filters,
      );

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream'), {
          type: req.headers.accept,
          disposition: `attachment; filename="daily-emissions-facility-aggregation-${0}.json"`,
        }),
      );
    });
  });

  describe('getEmissionsStateAggregation', () => {
    it('calls DayUnitDataRepository.getEmissionsStateAggregation() and gets all emissions from the repository', async () => {
      const expected = [{ date: '2019-01-01' }];
      repository.getEmissionsStateAggregation.mockResolvedValue(expected);
      let filters = new PaginatedDailyApportionedEmissionsParamsDTO();
      let result = await service.getEmissionsStateAggregation(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('streamEmissionsStateAggregation', () => {
    it('calls DailyUnitDataRepository.getStateStreamQuery() and streams all emissions from the repository', async () => {
      repository.getStateStreamQuery.mockResolvedValue('');

      let filters = new DailyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsStateAggregation(req, filters);

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream'), {
          type: req.headers.accept,
          disposition: `attachment; filename="daily-emissions-state-aggregation-${0}.json"`,
        }),
      );
    });
  });

  describe('getEmissionsNationalAggregation', () => {
    it('calls DayUnitDataRepository.getEmissionsNationalAggregation() and gets all emissions from the repository', async () => {
      const expected = [{ date: '2019-01-01' }];
      repository.getEmissionsNationalAggregation.mockResolvedValue(expected);
      let filters = new PaginatedDailyApportionedEmissionsParamsDTO();
      let result = await service.getEmissionsNationalAggregation(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('streamEmissionsNationalAggregation', () => {
    it('calls DailyUnitDataRepository.getNationalStreamQuery() and streams all emissions from the repository', async () => {
      repository.getNationalStreamQuery.mockResolvedValue('');

      let filters = new DailyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsNationalAggregation(
        req,
        filters,
      );

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream'), {
          type: req.headers.accept,
          disposition: `attachment; filename="daily-emissions-national-aggregation-${0}.json"`,
        }),
      );
    });
  });
});
