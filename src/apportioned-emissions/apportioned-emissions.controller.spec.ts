import { Test } from '@nestjs/testing';

import { ApportionedEmissionsService } from './apportioned-emissions.service';
import { ApportionedEmissionsController } from './apportioned-emissions.controller';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { DailyApportionedEmissionsDTO } from '../dto/daily-apportioned-emissions.dto';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsMap } from '../maps/daily-apportioned-emissions.map';
import { DailyApportionedEmissionsParamsDTO } from '../dto/daily-apportioned-emissions.params.dto';
import { MonthlyApportionedEmissionsParamsDTO } from '../dto/monthly-apportioned-emissions.params.dto';
import { MonthlyApportionedEmissionsDTO } from '../dto/monthly-apportioned-emissions.dto';
import { MonthlyApportionedEmissionsMap } from '../maps/monthly-apportioned-emissions.map';
import { MonthUnitDataRepository } from './month-unit-data.repository';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Apportioned Emissions Controller --', () => {
  let apportionedEmissionsController: ApportionedEmissionsController;
  let apportionedEmissionsService: ApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [ApportionedEmissionsController],
      providers: [
        HourlyApportionedEmissionsMap,
        DailyApportionedEmissionsMap,
        MonthlyApportionedEmissionsMap,
        ApportionedEmissionsService,
        HourUnitDataRepository,
        DayUnitDataRepository,
        MonthUnitDataRepository,
      ],
    }).compile();

    apportionedEmissionsController = module.get(ApportionedEmissionsController);
    apportionedEmissionsService = module.get(ApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getHourlyEmissions', () => {
    it('should return test 1', async () => {
      const expectedResult: HourlyApportionedEmissionsDTO[] = [];
      const paramsDto = new HourlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(apportionedEmissionsService, 'getHourlyEmissions')
        .mockResolvedValue(expectedResult);
      expect(
        await apportionedEmissionsController.getHourlyEmissions(paramsDto, req),
      ).toBe(expectedResult);
    });
  });

  describe('* getDailyEmissions', () => {
    it('should call the service and return a list of daily emissions', async () => {
      const expectedResult: DailyApportionedEmissionsDTO[] = [];
      const paramsDto = new DailyApportionedEmissionsParamsDTO();
      jest
        .spyOn(apportionedEmissionsService, 'getDailyEmissions')
        .mockResolvedValue(expectedResult);
      expect(
        await apportionedEmissionsController.getDailyEmissions(paramsDto, req),
      ).toBe(expectedResult);
    });
  });

  describe('* getMonthlyEmissions', () => {
    it('should call the service and return a list of monthly emissions', async () => {
      const expectedResult: MonthlyApportionedEmissionsDTO[] = [];
      const paramsDto = new MonthlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(apportionedEmissionsService, 'getMonthlyEmissions')
        .mockResolvedValue(expectedResult);
      expect(
        await apportionedEmissionsController.getMonthlyEmissions(paramsDto, req),
      ).toBe(expectedResult);
    });
  });
});
