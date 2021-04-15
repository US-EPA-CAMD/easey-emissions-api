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

const mockHourUnitDataRepository = () => ({
  getHourlyEmissions: jest.fn(),
});

const mockDayUnitDataRepository = () => ({
  getDailyEmissions: jest.fn(),
});

const mockMonthUnitDataRepository = () => ({
  getMonthlyEmissions: jest.fn(),
});

const mockMap = () => ({
  many: jest.fn(),
});

describe('-- Apportioned Emissions Service --', () => {
  let apportionedEmissionsService;
  let hourUnitDataRepository;
  let dayUnitDataRepository;
  let monthUnitDataRepository;
  let hourlyMap;
  let dailyMap;
  let monthlyMap;

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
        { provide: HourlyApportionedEmissionsMap, useFactory: mockMap },
        { provide: DailyApportionedEmissionsMap, useFactory: mockMap },
        { provide: MonthlyApportionedEmissionsMap, useFactory: mockMap },
      ],
    }).compile();

    apportionedEmissionsService = module.get(ApportionedEmissionsService);
    hourUnitDataRepository = module.get(HourUnitDataRepository);
    hourlyMap = module.get(HourlyApportionedEmissionsMap);
    dayUnitDataRepository = module.get(DayUnitDataRepository);
    dailyMap = module.get(DailyApportionedEmissionsMap);
    monthUnitDataRepository = module.get(MonthUnitDataRepository);
    monthlyMap = module.get(MonthlyApportionedEmissionsMap);
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

      let result = await apportionedEmissionsService.getDailyEmissions(filters);

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

      let result = await apportionedEmissionsService.getMonthlyEmissions(filters);

      expect(monthlyMap.many).toHaveBeenCalled();
      expect(result).toEqual(monthDto);
    });
  });
});
