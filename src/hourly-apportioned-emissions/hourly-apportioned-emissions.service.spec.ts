import { Test } from '@nestjs/testing';

import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { State } from '../enums/state.enum';
import { UnitType } from '../enums/unit-type.enum';
import { ResponseHeaders } from '../utils/response.headers';

const mockHourUnitDataRepository = () => ({
  getHourlyEmissions: jest.fn(),
});

const mockMap = () => ({
  many: jest.fn(),
});

describe('HourlyApportionedEmissionsService', () => {
  let hourlyApportionedEmissionsService;
  let hourUnitDataRepository;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HourlyApportionedEmissionsService,
        {
          provide: HourUnitDataRepository,
          useFactory: mockHourUnitDataRepository,
        },
        { provide: HourlyApportionedEmissionsMap, useFactory: mockMap },
      ],
    }).compile();

    hourlyApportionedEmissionsService = module.get<
      HourlyApportionedEmissionsService
    >(HourlyApportionedEmissionsService);
    hourUnitDataRepository = module.get<HourUnitDataRepository>(
      HourUnitDataRepository,
    );
    map = module.get<HourlyApportionedEmissionsMap>(
      HourlyApportionedEmissionsMap,
    );
  });

  describe('getHourlyEmissions', () => {
    it('calls HourUnitDataRepository.getHourlyEmissions() and gets all emissions from the repository', async () => {
      hourUnitDataRepository.getHourlyEmissions.mockResolvedValue(
        'list of emissions',
      );
      map.many.mockReturnValue('mapped DTOs');

      const filters: HourlyApportionedEmissionsParamsDTO = {
        page: undefined,
        perPage: undefined,
        orderBy: undefined,
        beginDate: new Date(),
        endDate: new Date(),
        state: State.TX,
        orisCode: 3,
        unitType: UnitType.BUBBLING_FLUIDIZED,
        unitFuelType: undefined,
        controlTechnologies: undefined,
        opHoursOnly: false,
      };

      let result = await hourlyApportionedEmissionsService.getHourlyEmissions(
        filters,
      );
      expect(hourUnitDataRepository.getHourlyEmissions).toHaveBeenCalledWith(
        filters,
      );
      expect(map.many).toHaveBeenCalled();
      expect(result).toEqual('mapped DTOs');
    });

    it('calls HourUnitDataRepository.getHourlyEmissions() with pagination parameters and gets all emissions from the repository', async () => {
      hourUnitDataRepository.getHourlyEmissions.mockResolvedValue(
        'list of emissions',
      );
      ResponseHeaders.setPagination = jest
        .fn()
        .mockReturnValue('paginated results');
      map.many.mockReturnValue('mapped DTOs');

      const paginatedFilters: HourlyApportionedEmissionsParamsDTO = {
        page: 1,
        perPage: 10,
        orderBy: undefined,
        beginDate: new Date(),
        endDate: new Date(),
        state: State.TX,
        orisCode: 3,
        unitType: UnitType.BUBBLING_FLUIDIZED,
        unitFuelType: undefined,
        controlTechnologies: undefined,
        opHoursOnly: false,
      };

      const paginatedResult = await hourlyApportionedEmissionsService.getHourlyEmissions(
        paginatedFilters,
      );

      expect(hourUnitDataRepository.getHourlyEmissions).toHaveBeenCalledWith(
        paginatedFilters,
      );
      expect(ResponseHeaders.setPagination).toHaveBeenCalled();
      expect(map.many).toHaveBeenCalled();

      expect(paginatedResult).toEqual('mapped DTOs');
    });
  });
});
