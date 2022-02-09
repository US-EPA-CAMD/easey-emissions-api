import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AnnualUnitDataView } from '../../entities/vw-annual-unit-data.entity';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';

import {
  AnnualApportionedEmissionsParamsDTO,
  PaginatedAnnualApportionedEmissionsParamsDTO,
} from '../../dto/annual-apportioned-emissions.params.dto';

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

const mockRepository = () => ({
  getEmissions: jest.fn(),
  streamEmissions: jest.fn(),
});

const mockRequest = () => {
  return {
    headers: {
      accept: '',
    },
    res: {
      setHeader: jest.fn(),
    },
  };
};

let service: AnnualApportionedEmissionsService;
let repository: any;
let req: any;

describe('-- Annual Apportioned Emissions Service --', () => {
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        AnnualApportionedEmissionsService,
        {
          provide: AnnualUnitDataRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(AnnualApportionedEmissionsService);
    repository = module.get(AnnualUnitDataRepository);
  });

  describe('getEmissions', () => {
    it('calls AnnualUnitDataRepository.getEmissions() and gets all emissions from the repository', async () => {
      const expected = AnnualUnitDataView[0];
      repository.getEmissions.mockResolvedValue(expected);
      let filters = new PaginatedAnnualApportionedEmissionsParamsDTO();
      let result = await service.getEmissions(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('streamEmissions', () => {
    it('calls AnnualUnitDataRepository.streamEmissions() and streams all emissions from the repository', async () => {
      const expectedResult = Buffer.from('stream');

      const mockStream = {
        pipe: jest.fn().mockReturnValue({
          pipe: jest.fn().mockReturnValue(expectedResult),
        }),
      };
      repository.streamEmissions.mockResolvedValue(mockStream);
      let filters = new AnnualApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissions(req, filters);

      expect(result).toEqual(
        new StreamableFile(expectedResult, {
          type: req.headers.accept,
          disposition: `attachment; filename="annual-emissions-${0}.json"`,
        }),
      );
    });
  });
});
