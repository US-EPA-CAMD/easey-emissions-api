import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { PaginatedHourlyApportionedEmissionsParamsDTO } from '../../dto/hourly-apportioned-emissions.params.dto';
import {
  genHourlyApportionedEmissionsFacilityDto,
  genHourlyApportionedEmissionsNationalDto,
  genHourlyApportionedEmissionsStateDto,
  genHourUnitData,
} from '../../../test/object-generators/apportioned-emissions';
import { HourUnitDataView } from '../../entities/vw-hour-unit-data.entity';

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

describe('-- Hourly Apportioned Emissions Service --', () => {
  let service: HourlyApportionedEmissionsService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ConfigService,
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
      const expected = genHourUnitData<HourUnitDataView>();
      console.log(expected)
      repository.getEmissions.mockResolvedValue(expected);
      let filters = new PaginatedHourlyApportionedEmissionsParamsDTO();
      let result = await service.getEmissions(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('getEmissionsFacilityAggregation', () => {
    it('calls HourUnitDataRepository.getEmissionsFacilityAggregation() and gets all emissions from the repository', async () => {
      const expected = genHourlyApportionedEmissionsFacilityDto();
      console.log(expected);
      repository.getEmissionsFacilityAggregation.mockResolvedValue(expected);
      let filters = new PaginatedHourlyApportionedEmissionsParamsDTO();
      let result = await service.getEmissionsFacilityAggregation(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('getEmissionsStateAggregation', () => {
    it('calls HourUnitDataRepository.getEmissionsStateAggregation() and gets all emissions from the repository', async () => {
      const expected = genHourlyApportionedEmissionsStateDto();
      repository.getEmissionsStateAggregation.mockResolvedValue(expected);
      let filters = new PaginatedHourlyApportionedEmissionsParamsDTO();
      let result = await service.getEmissionsStateAggregation(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('getEmissionsNationalAggregation', () => {
    it('calls HourUnitDataRepository.getEmissionsNationalAggregation() and gets all emissions from the repository', async () => {
      const expected = genHourlyApportionedEmissionsNationalDto();
      repository.getEmissionsNationalAggregation.mockResolvedValue(expected);
      let filters = new PaginatedHourlyApportionedEmissionsParamsDTO();
      let result = await service.getEmissionsNationalAggregation(req, filters);
      expect(result).toEqual(expected);
    });
  });
});
