import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import {
  genHourlyApportionedEmissionsFacilityDto,
  genHourlyApportionedEmissionsNationalDto,
  genHourlyApportionedEmissionsStateDto,
  genHourUnitData,
} from '../../../test/object-generators/apportioned-emissions';
import { PaginatedHourlyApportionedEmissionsParamsDTO } from '../../dto/hourly-apportioned-emissions.params.dto';
import { HourUnitDataView } from '../../entities/vw-hour-unit-data.entity';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsController } from './hourly-apportioned-emissions.controller';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Hourly Apportioned Emissions Controller --', () => {
  let controller: HourlyApportionedEmissionsController;
  let service: HourlyApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [HourlyApportionedEmissionsController],
      providers: [
        EntityManager,
        HourlyApportionedEmissionsService,
        HourUnitDataRepository,
      ],
    }).compile();

    controller = module.get(HourlyApportionedEmissionsController);
    service = module.get(HourlyApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getEmissions', () => {
    it('calls HourlyApportionedEmissionsService.getEmissions() and returns all emissions data', async () => {
      const mockedValues = genHourUnitData<HourUnitDataView>();
      const paramsDto = new PaginatedHourlyApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'getEmissions').mockResolvedValue(mockedValues);
      expect(await controller.getEmissions(req, paramsDto)).toBe(mockedValues);
    });
  });

  describe('* getEmissionsFacilityAggregation', () => {
    it('calls HourlyApportionedEmissionsService.getEmissionsFacilityAggregation() and gets all emissions data', async () => {
      const mockedValues = genHourlyApportionedEmissionsFacilityDto();
      const paramsDto = new PaginatedHourlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissionsFacilityAggregation')
        .mockResolvedValue(mockedValues);
      const results = await controller.getEmissionsFacilityAggregation(
        req,
        paramsDto,
      );
      expect(results).toBe(mockedValues);
    });
  });

  describe('* getEmissionsStateAggregation', () => {
    it('calls HourlyApportionedEmissionsService.getEmissionsStateAggregation() and gets all emissions data', async () => {
      const mockedValues = genHourlyApportionedEmissionsStateDto();
      const paramsDto = new PaginatedHourlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissionsStateAggregation')
        .mockResolvedValue(mockedValues);
      const results = await controller.getEmissionsStateAggregation(
        req,
        paramsDto,
      );
      expect(results).toBe(mockedValues);
    });
  });

  describe('* getEmissionsNationalAggregation', () => {
    it('calls HourlyApportionedEmissionsService.getEmissionsNationalAggregation() and gets all emissions data', async () => {
      const mockedValues = genHourlyApportionedEmissionsNationalDto();
      const paramsDto = new PaginatedHourlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissionsNationalAggregation')
        .mockResolvedValue(mockedValues);
      const results = await controller.getEmissionsNationalAggregation(
        req,
        paramsDto,
      );
      expect(results).toBe(mockedValues);
    });
  });
});
