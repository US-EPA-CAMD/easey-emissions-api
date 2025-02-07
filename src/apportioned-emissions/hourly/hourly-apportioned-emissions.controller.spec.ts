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
      const hourlyList = genHourUnitData<HourUnitDataView>();
      const mockedValues = {
        items: hourlyList
      }
      const paramsDto = new PaginatedHourlyApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'getEmissions').mockResolvedValue(hourlyList);
      expect(await controller.getEmissions(req, paramsDto)).toEqual(mockedValues);
    });
  });

  describe('* getEmissionsFacilityAggregation', () => {
    it('calls HourlyApportionedEmissionsService.getEmissionsFacilityAggregation() and gets all emissions data', async () => {
      const byFacilityList = genHourlyApportionedEmissionsFacilityDto();
      const mockedValues = {
        items: byFacilityList
      }
      const paramsDto = new PaginatedHourlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissionsFacilityAggregation')
        .mockResolvedValue(byFacilityList);
      const results = await controller.getEmissionsFacilityAggregation(
        req,
        paramsDto,
      );
      expect(results).toEqual(mockedValues);
    });
  });

  describe('* getEmissionsStateAggregation', () => {
    it('calls HourlyApportionedEmissionsService.getEmissionsStateAggregation() and gets all emissions data', async () => {
      const byStateList = genHourlyApportionedEmissionsStateDto();
      const mockedValues = {
        items : byStateList
      }
      const paramsDto = new PaginatedHourlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissionsStateAggregation')
        .mockResolvedValue(byStateList);
      const results = await controller.getEmissionsStateAggregation(
        req,
        paramsDto,
      );
      expect(results).toEqual(mockedValues);
    });
  });

  describe('* getEmissionsNationalAggregation', () => {
    it('calls HourlyApportionedEmissionsService.getEmissionsNationalAggregation() and gets all emissions data', async () => {
      const nationallyList = genHourlyApportionedEmissionsNationalDto();
      const mockedValues = {
        items: nationallyList
      }
      const paramsDto = new PaginatedHourlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissionsNationalAggregation')
        .mockResolvedValue(nationallyList);
      const results = await controller.getEmissionsNationalAggregation(
        req,
        paramsDto,
      );
      expect(results).toEqual(mockedValues);
    });
  });
});
