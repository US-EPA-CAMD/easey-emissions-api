import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AnnualUnitDataView } from '../../entities/vw-annual-unit-data.entity';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';
import { PaginatedAnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';

const mockRepository = () => ({
  getEmissions: jest.fn(),
  getEmissionsFacilityAggregation: jest.fn(),
  getEmissionsStateAggregation: jest.fn(),
  getEmissionsNationalAggregation: jest.fn(),
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

describe('-- Annual Apportioned Emissions Service --', () => {
  let service: AnnualApportionedEmissionsService;
  let repository: any;
  let req: any;

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

  describe('getEmissionsFacilityAggregation', () => {
    it('calls AnnualUnitDataRepository.getEmissionsFacilityAggregation() and gets all emissions from the repository', async () => {
      const expected = [{ year: 2019 }];
      repository.getEmissionsFacilityAggregation.mockResolvedValue(expected);
      let filters = new PaginatedAnnualApportionedEmissionsParamsDTO();
      let result = await service.getEmissionsFacilityAggregation(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('getEmissionsStateAggregation', () => {
    it('calls AnnualUnitDataRepository.getEmissionsStateAggregation() and gets all emissions from the repository', async () => {
      const expected = [{ year: 2019 }];
      repository.getEmissionsStateAggregation.mockResolvedValue(expected);
      let filters = new PaginatedAnnualApportionedEmissionsParamsDTO();
      let result = await service.getEmissionsStateAggregation(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('getEmissionsNationalAggregation', () => {
    it('calls AnnualUnitDataRepository.getEmissionsNationalAggregation() and gets all emissions from the repository', async () => {
      const expected = [{ year: 2019 }];
      repository.getEmissionsNationalAggregation.mockResolvedValue(expected);
      let filters = new PaginatedAnnualApportionedEmissionsParamsDTO();
      let result = await service.getEmissionsNationalAggregation(req, filters);
      expect(result).toEqual(expected);
    });
  });
});
