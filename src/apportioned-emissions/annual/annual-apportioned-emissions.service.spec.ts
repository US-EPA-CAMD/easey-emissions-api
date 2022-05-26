import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AnnualUnitDataView } from '../../entities/vw-annual-unit-data.entity';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';
import { PaginatedAnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';

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

let service: AnnualApportionedEmissionsService;
let repository: any;
let req: any;

describe('-- Annual Apportioned Emissions Service --', () => {
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ConfigService,
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
});
