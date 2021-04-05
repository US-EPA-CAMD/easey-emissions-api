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

const mockHourUnitDataRepository = () => ({
  getHourlyEmissions: jest.fn(),
});

const mockDayUnitDataRepository = () => ({
  getDailyEmissions: jest.fn(),
});

const mockMap = () => ({
  many: jest.fn(),
});

describe('-- Apportioned Emissions Service --', () => {
  let apportionedEmissionsService;
  let hourUnitDataRepository;
  let dayUnitDataRepository;
  let hourlyMap;
  let dailyMap;

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
        { provide: HourlyApportionedEmissionsMap, useFactory: mockMap },
        { provide: DailyApportionedEmissionsMap, useFactory: mockMap },
      ],
    }).compile();

    apportionedEmissionsService = module.get(ApportionedEmissionsService);
    hourUnitDataRepository = module.get(HourUnitDataRepository);
    hourlyMap = module.get(HourlyApportionedEmissionsMap);
    dayUnitDataRepository = module.get(DayUnitDataRepository);
    dailyMap = module.get(DailyApportionedEmissionsMap);
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

  describe('getDailyEmissions', () => {
    it('should return hello world', async () => {
      // monthly dto coverage, will remove in feature/1018
      const monthDto = new MonthlyApportionedEmissionsDTO();
      let filters = new DailyApportionedEmissionsParamsDTO();
      expect(apportionedEmissionsService.getMonthlyEmissions(filters)).toBe(
        'Hello World!',
      );
    });
  });
});
