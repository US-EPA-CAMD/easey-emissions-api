import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { QuarterUnitDataView } from '../../entities/vw-quarter-unit-data.entity';
import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { QuarterlyApportionedEmissionsService } from './quarterly-apportioned-emissions.service';

import {
  QuarterlyApportionedEmissionsParamsDTO,
  PaginatedQuarterlyApportionedEmissionsParamsDTO,
} from '../../dto/quarterly-apportioned-emissions.params.dto';

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

describe('-- Quarterly Apportioned Emissions Service --', () => {
  let service: QuarterlyApportionedEmissionsService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        QuarterlyApportionedEmissionsService,
        {
          provide: QuarterUnitDataRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(QuarterlyApportionedEmissionsService);
    repository = module.get(QuarterUnitDataRepository);
  });

  describe('getEmissions', () => {
    it('calls QuarterUnitDataRepository.getEmissions() and gets all emissions from the repository', async () => {
      const expected = QuarterUnitDataView[0];
      repository.getEmissions.mockResolvedValue(expected);
      let filters = new PaginatedQuarterlyApportionedEmissionsParamsDTO();
      let result = await service.getEmissions(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('streamEmissions', () => {
    it('calls QuarterlyUnitDataRepository.streamEmissions() and streams all emissions from the repository', async () => {
      const expectedResult = Buffer.from('stream');

      const mockStream = {
        pipe: jest.fn().mockReturnValue({
          pipe: jest.fn().mockReturnValue(expectedResult),
        }),
      };
      repository.streamEmissions.mockResolvedValue(mockStream);
      let filters = new QuarterlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissions(req, filters);

      expect(result).toEqual(
        new StreamableFile(expectedResult, {
          type: req.headers.accept,
          disposition: `attachment; filename="quarterly-emissions-${0}.json"`,
        }),
      );
    });
  });
});
