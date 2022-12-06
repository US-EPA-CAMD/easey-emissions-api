import { Test } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { DayUnitDataView } from '../../entities/vw-day-unit-data.entity';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';
import { DailyApportionedEmissionsController } from './daily-apportioned-emissions.controller';
import { PaginatedDailyApportionedEmissionsParamsDTO } from '../../dto/daily-apportioned-emissions.params.dto';
import {
  genDailyApportionedEmissionsFacilityDto,
  genDailyApportionedEmissionsNationalDto,
  genDailyApportionedEmissionsStateDto,
  genDayUnitData,
} from '../../../test/object-generators/apportioned-emissions';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Daily Apportioned Emissions Controller --', () => {
  let controller: DailyApportionedEmissionsController;
  let service: DailyApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [DailyApportionedEmissionsController],
      providers: [DayUnitDataRepository, DailyApportionedEmissionsService],
    }).compile();

    controller = module.get(DailyApportionedEmissionsController);
    service = module.get(DailyApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getEmissions', () => {
    it('calls DailyApportionedEmissionsService.getEmissions() and returns all emissions data', async () => {
      const mockedValues = genDayUnitData<DayUnitDataView>();
      const paramsDto = new PaginatedDailyApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'getEmissions').mockResolvedValue(mockedValues);
      expect(await controller.getEmissions(req, paramsDto)).toBe(mockedValues);
    });
  });

  describe('* getEmissionsFacilityAggregation', () => {
    it('calls DailyApportionedEmissionsService.getEmissionsFacilityAggregation() and gets all emissions data', async () => {
      const mockedValues = genDailyApportionedEmissionsFacilityDto();
      const paramsDto = new PaginatedDailyApportionedEmissionsParamsDTO();
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
    it('calls DailyApportionedEmissionsService.getEmissionsStateAggregation() and gets all emissions data', async () => {
      const mockedValues = genDailyApportionedEmissionsStateDto();
      const paramsDto = new PaginatedDailyApportionedEmissionsParamsDTO();
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
    it('calls DailyApportionedEmissionsService.getEmissionsNationalAggregation() and gets all emissions data', async () => {
      const mockedValues = genDailyApportionedEmissionsNationalDto();
      const paramsDto = new PaginatedDailyApportionedEmissionsParamsDTO();
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
