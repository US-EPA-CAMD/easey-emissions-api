import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { HourUnitDataView } from '../../entities/vw-hour-unit-data.entity';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';

import {
  HourlyApportionedEmissionsParamsDTO,
  PaginatedHourlyApportionedEmissionsParamsDTO,
} from '../../dto/hourly-apportioned-emissions.params.dto';

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

const mockRepository = () => ({
  getEmissions: jest.fn(),
  streamEmissions: jest.fn(),
});

const mockRequest = () => {
  return {
    headers: { accept: '' },
    res: {
      setHeader: jest.fn(),
    },
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

  describe('streamEmissions', () => {
    it('calls HourlyUnitDataRepository.streamEmissions() and streams all emissions from the repository', async () => {
      const expectedResult = Buffer.from('stream');

      const mockStream = {
        pipe: jest.fn().mockReturnValue({
          pipe: jest.fn().mockReturnValue(expectedResult),
        }),
      };
      repository.streamEmissions.mockResolvedValue(mockStream);
      let filters = new HourlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissions(req, filters);

      expect(result).toEqual(
        new StreamableFile(expectedResult, {
          type: req.headers.accept,
          disposition: `attachment; filename="hourly-emissions-${0}.json"`,
        }),
      );
    });
  });
});
