import { Test } from '@nestjs/testing';

import { ApportionedEmissionsService } from './apportioned-emissions.service';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsMap } from '../maps/daily-apportioned-emissions.map';
import { ApportionedEmissionsParamsDTO } from '../dto/apportioned-emissions.params.dto';

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
      hourlyMap.many.mockReturnValue('mapped DTOs');

      let filters = new HourlyApportionedEmissionsParamsDTO();

      let result = await apportionedEmissionsService.getHourlyEmissions(
        filters,
      );

      expect(hourlyMap.many).toHaveBeenCalled();
      expect(result).toEqual('mapped DTOs');
    });
  });

  describe('getDailyEmissions', () => {
    it('calls DayUnitDataRepository.getDailyEmissions() and gets all emissions from the repository', async () => {
      dayUnitDataRepository.getDailyEmissions.mockResolvedValue(
        'list of emissions',
      );
      dailyMap.many.mockReturnValue('mapped DTOs');

      let filters = new ApportionedEmissionsParamsDTO();

      let result = await apportionedEmissionsService.getDailyEmissions(
        filters,
      );

      expect(dailyMap.many).toHaveBeenCalled();
      expect(result).toEqual('mapped DTOs');
    });
  });
});
