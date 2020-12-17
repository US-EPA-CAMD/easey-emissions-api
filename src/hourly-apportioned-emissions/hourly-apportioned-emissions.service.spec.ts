import { Test } from '@nestjs/testing';

import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { State } from '../enums/state.enum';
import { UnitType } from '../enums/unit-type.enum';
import { UnitFuelType } from '../enums/unit-fuel-type.enum';
import { ControlTechnology } from '../enums/control-technology.enum';
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

    hourlyApportionedEmissionsService = await module.get<
      HourlyApportionedEmissionsService
    >(HourlyApportionedEmissionsService);
    hourUnitDataRepository = await module.get<HourUnitDataRepository>(
      HourUnitDataRepository,
    );
    map = await module.get<HourlyApportionedEmissionsMap>(
      HourlyApportionedEmissionsMap,
    );
  });

  describe('getHourlyEmissions', () => {
    it('calls HourUnitDataRepository.getHourlyEmissions() and gets all emissions from the repository', async () => {
      hourUnitDataRepository.getHourlyEmissions.mockResolvedValue(
        'list of emissions',
      );
      ResponseHeaders.setPagination = jest
        .fn()
        .mockReturnValue('paginated results');
      map.many.mockReturnValue('mapped DTOs');

      const filters: HourlyApportionedEmissionsParamsDTO = {
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

      const result = await hourlyApportionedEmissionsService.getHourlyEmissions(
        filters,
      );

      expect(hourUnitDataRepository.getHourlyEmissions).toHaveBeenCalledWith(
        filters,
      );
      expect(ResponseHeaders.setPagination).toHaveBeenCalled();
      expect(map.many).toHaveBeenCalled();

      expect(result).toEqual('mapped DTOs');
    });
  });
});
