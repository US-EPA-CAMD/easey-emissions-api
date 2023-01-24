import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonthUnitDataView } from '../../entities/vw-month-unit-data.entity';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';
import { PaginatedMonthlyApportionedEmissionsParamsDTO } from '../../dto/monthly-apportioned-emissions.params.dto';

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

describe('-- Monthly Apportioned Emissions Service --', () => {
  let service: MonthlyApportionedEmissionsService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
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

  describe('getEmissionsFacilityAggregation', () => {
    it('calls MonthUnitDataRepository.getEmissionsFacilityAggregation() and gets all emissions from the repository', async () => {
      const expected = [{ month: 1 }];
      repository.getEmissionsFacilityAggregation.mockResolvedValue(expected);
      let filters = new PaginatedMonthlyApportionedEmissionsParamsDTO();
      let result = await service.getEmissionsFacilityAggregation(req, filters);
      expect(result).toEqual(expected);
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

  describe('getEmissionsNationalAggregation', () => {
    it('calls MonthUnitDataRepository.getEmissionsNationalAggregation() and gets all emissions from the repository', async () => {
      const expected = [{ month: 1 }];
      repository.getEmissionsNationalAggregation.mockResolvedValue(expected);
      let filters = new PaginatedMonthlyApportionedEmissionsParamsDTO();
      let result = await service.getEmissionsNationalAggregation(req, filters);
      expect(result).toEqual(expected);
    });
  });
});
