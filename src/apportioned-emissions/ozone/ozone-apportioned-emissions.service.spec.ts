import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
import { OzoneApportionedEmissionsService } from './ozone-apportioned-emissions.service';
import { PaginatedOzoneApportionedEmissionsParamsDTO } from '../../dto/ozone-apportioned-emissions.params.dto';
import {
  genAnnualApportionedEmissionsFacilityDto,
  genAnnualApportionedEmissionsNationalDto,
  genAnnualApportionedEmissionsStateDto,
  genAnnualUnitData,
} from '../../../test/object-generators/apportioned-emissions';
import { AnnualUnitDataView } from '../../entities/vw-annual-unit-data.entity';

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

describe('-- Ozone Apportioned Emissions Service --', () => {
  let service: OzoneApportionedEmissionsService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ConfigService,
        OzoneApportionedEmissionsService,
        {
          provide: OzoneUnitDataRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(OzoneApportionedEmissionsService);
    repository = module.get(OzoneUnitDataRepository);
  });

  describe('getEmissions', () => {
    it('calls OzoneUnitDataRepository.getEmissions() and gets all emissions from the repository', async () => {
      const expected = genAnnualUnitData<AnnualUnitDataView>();
      repository.getEmissions.mockResolvedValue(expected);
      let filters = new PaginatedOzoneApportionedEmissionsParamsDTO();
      let result = await service.getEmissions(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('getEmissionsFacilityAggregation', () => {
    it('calls OzoneUnitDataRepository.getEmissionsFacilityAggregation() and gets all emissions from the repository', async () => {
      const expected = genAnnualApportionedEmissionsFacilityDto();
      repository.getEmissionsFacilityAggregation.mockResolvedValue(expected);
      let filters = new PaginatedOzoneApportionedEmissionsParamsDTO();
      let result = await service.getEmissionsFacilityAggregation(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('getEmissionsStateAggregation', () => {
    it('calls OzoneUnitDataRepository.getEmissionsStateAggregation() and gets all emissions from the repository', async () => {
      const expected = genAnnualApportionedEmissionsStateDto();
      repository.getEmissionsStateAggregation.mockResolvedValue(expected);
      let filters = new PaginatedOzoneApportionedEmissionsParamsDTO();
      let result = await service.getEmissionsStateAggregation(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('getEmissionsNationalAggregation', () => {
    it('calls OzoneUnitDataRepository.getEmissionsNationalAggregation() and gets all emissions from the repository', async () => {
      const expected = genAnnualApportionedEmissionsNationalDto();
      repository.getEmissionsNationalAggregation.mockResolvedValue(expected);
      let filters = new PaginatedOzoneApportionedEmissionsParamsDTO();
      let result = await service.getEmissionsNationalAggregation(req, filters);
      expect(result).toEqual(expected);
    });
  });
});
