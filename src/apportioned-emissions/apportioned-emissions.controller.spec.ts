import { Test } from '@nestjs/testing';

import { ApportionedEmissionsService } from './apportioned-emissions.service';
import { ApportionedEmissionsController } from './apportioned-emissions.controller';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { ApportionedEmissionsParamsDTO } from '../dto/apportioned-emissions.params.dto';
import { DailyApportionedEmissionsDTO } from '../dto/daily-apportioned-emissions.dto';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsMap } from '../maps/daily-apportioned-emissions.map';

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

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [ApportionedEmissionsController],
      providers: [
        HourlyApportionedEmissionsMap,
        DailyApportionedEmissionsMap,
        ApportionedEmissionsService,
        HourUnitDataRepository,
        DayUnitDataRepository,
      ],
    }).compile();

    apportionedEmissionsController = module.get(ApportionedEmissionsController);
    apportionedEmissionsService = module.get(ApportionedEmissionsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getHourlyEmissions', () => {
    const req: any = mockRequest('');
    req.res.setHeader.mockReturnValue();

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
    const req: any = mockRequest('');
    req.res.setHeader.mockReturnValue();

    it('should call the service and return a list of daily emissions', async () => {
      const expectedResult: DailyApportionedEmissionsDTO[] = [];
      const paramsDto = new ApportionedEmissionsParamsDTO();
      jest
        .spyOn(apportionedEmissionsService, 'getDailyEmissions')
        .mockResolvedValue(expectedResult);
      expect(
        await apportionedEmissionsController.getDailyEmissions(paramsDto, req),
      ).toBe(expectedResult);
    });
  });
});
