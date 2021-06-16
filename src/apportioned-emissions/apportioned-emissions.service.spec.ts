import { Test } from '@nestjs/testing';

import { ApportionedEmissionsService } from './apportioned-emissions.service';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsMap } from '../maps/daily-apportioned-emissions.map';
import { DailyApportionedEmissionsDTO } from '../dto/daily-apportioned-emissions.dto';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { MonthlyApportionedEmissionsDTO } from '../dto/monthly-apportioned-emissions.dto';
import { DailyApportionedEmissionsParamsDTO } from '../dto/daily-apportioned-emissions.params.dto';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsMap } from '../maps/monthly-apportioned-emissions.map';
import { MonthlyApportionedEmissionsParamsDTO } from '../dto/monthly-apportioned-emissions.params.dto';
import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { QuarterlyApportionedEmissionsMap } from '../maps/quarterly-apportioned-emissions.map';
import { QuarterlyApportionedEmissionsDTO } from '../dto/quarterly-apportioned-emissions.dto';
import { QuarterlyApportionedEmissionsParamsDTO } from '../dto/quarterly-apportioned-emissions.params.dto';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsMap } from '../maps/annual-apportioned-emissions.map';
import { AnnualApportionedEmissionsDTO } from '../dto/annual-apportioned-emissions.dto';
import { AnnualApportionedEmissionsParamsDTO } from '../dto/annual-apportioned-emissions.params.dto';

const mockHourUnitDataRepository = () => ({
  getHourlyEmissions: jest.fn(),
});

const mockDayUnitDataRepository = () => ({
  getDailyEmissions: jest.fn(),
});

const mockMonthUnitDataRepository = () => ({
  getMonthlyEmissions: jest.fn(),
});

const mockQuarterUnitDataRepository = () => ({
  getQuarterlyEmissions: jest.fn(),
});

const mockAnnualUnitDataRepository = () => ({
  getAnnualEmissions: jest.fn(),
});

const mockMap = () => ({
  many: jest.fn(),
});

const mockRequest = () => {
  return {
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Apportioned Emissions Service --', () => {
  let apportionedEmissionsService;
  let hourUnitDataRepository;
  let dayUnitDataRepository;
  let monthUnitDataRepository;
  let quarterUnitDataRepository;
  let annualUnitDataRepository;
  let hourlyMap;
  let dailyMap;
  let monthlyMap;
  let quarterlyMap;
  let annualMap;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ApportionedEmissionsService,
        {
          provide: HourUnitDataRepository,
          useFactory: mockHourUnitDataRepository,
        },
        {
          provide: DayUnitDataRepository,
          useFactory: mockDayUnitDataRepository,
        },
        {
          provide: MonthUnitDataRepository,
          useFactory: mockMonthUnitDataRepository,
        },
        {
          provide: QuarterUnitDataRepository,
          useFactory: mockQuarterUnitDataRepository,
        },
        {
          provide: AnnualUnitDataRepository,
          useFactory: mockAnnualUnitDataRepository,
        },
        { provide: HourlyApportionedEmissionsMap, useFactory: mockMap },
        { provide: DailyApportionedEmissionsMap, useFactory: mockMap },
        { provide: MonthlyApportionedEmissionsMap, useFactory: mockMap },
        { provide: QuarterlyApportionedEmissionsMap, useFactory: mockMap },
        { provide: AnnualApportionedEmissionsMap, useFactory: mockMap },
      ],
    }).compile();

    apportionedEmissionsService = module.get(ApportionedEmissionsService);
    hourUnitDataRepository = module.get(HourUnitDataRepository);
    hourlyMap = module.get(HourlyApportionedEmissionsMap);
    dayUnitDataRepository = module.get(DayUnitDataRepository);
    dailyMap = module.get(DailyApportionedEmissionsMap);
    monthUnitDataRepository = module.get(MonthUnitDataRepository);
    monthlyMap = module.get(MonthlyApportionedEmissionsMap);
    quarterUnitDataRepository = module.get(QuarterUnitDataRepository);
    quarterlyMap = module.get(QuarterlyApportionedEmissionsMap);
    annualUnitDataRepository = module.get(AnnualUnitDataRepository);
    annualMap = module.get(AnnualApportionedEmissionsMap);
    req = mockRequest();
    req.res.setHeader.mockReturnValue();
  });

  describe('getHourlyEmissions', () => {
    it('calls HourUnitDataRepository.getHourlyEmissions() and gets all emissions from the repository', async () => {
      hourUnitDataRepository.getHourlyEmissions.mockResolvedValue(
        'list of emissions',
      );
      const hourDto = new HourlyApportionedEmissionsDTO();
      hourlyMap.many.mockReturnValue(hourDto);

      let filters = new HourlyApportionedEmissionsParamsDTO();

      let result = await apportionedEmissionsService.getHourlyEmissions(
        filters,
        req,
      );

      expect(hourlyMap.many).toHaveBeenCalled();
      expect(result).toEqual(hourDto);
    });
  });

  describe('getDailyEmissions', () => {
    it('calls DayUnitDataRepository.getDailyEmissions() and gets all emissions from the repository', async () => {
      dayUnitDataRepository.getDailyEmissions.mockResolvedValue(
        'list of emissions',
      );
      const dayDto = new DailyApportionedEmissionsDTO();
      dailyMap.many.mockReturnValue(dayDto);

      let filters = new DailyApportionedEmissionsParamsDTO();

      let result = await apportionedEmissionsService.getDailyEmissions(
        filters,
        req,
      );

      expect(dailyMap.many).toHaveBeenCalled();
      expect(result).toEqual(dayDto);
    });
  });

  describe('getMonthlyEmissions', () => {
    it('calls MonthUnitDataRepository.getMonthlyEmissions() and gets all emissions from the repository', async () => {
      monthUnitDataRepository.getMonthlyEmissions.mockResolvedValue(
        'list of emissions',
      );
      const monthDto = new MonthlyApportionedEmissionsDTO();
      monthlyMap.many.mockReturnValue(monthDto);

      let filters = new MonthlyApportionedEmissionsParamsDTO();

      let result = await apportionedEmissionsService.getMonthlyEmissions(
        filters,
        req,
      );

      expect(monthlyMap.many).toHaveBeenCalled();
      expect(result).toEqual(monthDto);
    });
  });

  describe('getQuarterlyEmissions', () => {
    it('calls QuarterUnitDataRepository.getQuarterlyEmissions() and gets all emissions from the repository', async () => {
      quarterUnitDataRepository.getQuarterlyEmissions.mockResolvedValue(
        'list of emissions',
      );
      const quarterDto = new QuarterlyApportionedEmissionsDTO();
      quarterlyMap.many.mockReturnValue(quarterDto);

      let filters = new QuarterlyApportionedEmissionsParamsDTO();

      let result = await apportionedEmissionsService.getQuarterlyEmissions(
        filters,
        req,
      );

      expect(quarterlyMap.many).toHaveBeenCalled();
      expect(result).toEqual(quarterDto);
    });
  });

  describe('getAnnualEmissions', () => {
    it('calls AnnualUnitDataRepository.getAnnualEmissions() and gets all emissions from the repository', async () => {
      annualUnitDataRepository.getAnnualEmissions.mockResolvedValue(
        'list of emissions',
      );
      const annualDto = new AnnualApportionedEmissionsDTO();
      annualMap.many.mockReturnValue(annualDto);

      let filters = new AnnualApportionedEmissionsParamsDTO();

      let result = await apportionedEmissionsService.getAnnualEmissions(
        filters,
        req,
      );

      expect(annualMap.many).toHaveBeenCalled();
      expect(result).toEqual(annualDto);
    });
  });
});
