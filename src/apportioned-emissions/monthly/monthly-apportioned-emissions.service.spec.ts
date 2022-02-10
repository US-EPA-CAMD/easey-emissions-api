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

describe('-- Monthly Apportioned Emissions Service --', () => {
  let service: MonthlyApportionedEmissionsService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
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
      const expectedResult = Buffer.from('stream');

      const mockStream = {
        pipe: jest.fn().mockReturnValue({
          pipe: jest.fn().mockReturnValue(expectedResult),
        }),
      };
      repository.streamEmissions.mockResolvedValue(mockStream);
      let filters = new MonthlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissions(req, filters);

      expect(result).toEqual(
        new StreamableFile(expectedResult, {
          type: req.headers.accept,
          disposition: `attachment; filename="monthly-emissions-${0}.json"`,
        }),
      );
    });
  });
});
