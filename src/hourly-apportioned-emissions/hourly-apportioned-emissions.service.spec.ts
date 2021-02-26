import { Test } from '@nestjs/testing';

import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';

import { HourUnitData } from '../entities/hour-unit-data.entity';
import { UnitFact } from '../entities/unit-fact.entity';
import { State } from '../enums/state.enum';
import { UnitType } from '../enums/unit-type.enum';
import { ControlTechnology } from '../enums/control-technology.enum';
import { UnitFuelType } from '../enums/unit-fuel-type.enum';

import { ResponseHeaders } from '../utils/response.headers';

const mockHourUnitDataRepository = () => ({
  getHourlyEmissions: jest.fn(),
});

const mockMap = () => ({
  many: jest.fn(),
});

let filters: HourlyApportionedEmissionsParamsDTO = {
  page: undefined,
  perPage: undefined,
  orderBy: undefined,
  beginDate: new Date(),
  endDate: new Date(),
  state: [State.TX],
  orisCode: [3],
  unitType: [UnitType.BUBBLING_FLUIDIZED],
  unitFuelType: [UnitFuelType.COAL],
  controlTechnologies: undefined,
  opHoursOnly: false,
};

let entity: HourUnitData = new HourUnitData();
entity.unitFact = new UnitFact();
entity.unitFact.noxControlInfo = ControlTechnology.ADDITIVES_TO_ENHANCE;
entity.unitFact.so2ControlInfo = ControlTechnology.AMMONIA_INJECTION;
entity.unitFact.partControlInfo = ControlTechnology.BAGHOUSE;
entity.unitFact.hgControlInfo = ControlTechnology.CATALYST;

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

    hourlyApportionedEmissionsService = module.get(
      HourlyApportionedEmissionsService,
    );
    hourUnitDataRepository = module.get(HourUnitDataRepository);
    map = module.get(HourlyApportionedEmissionsMap);
  });

  describe('getHourlyEmissions', () => {
    it('calls HourUnitDataRepository.getHourlyEmissions() and gets all emissions from the repository', async () => {
      hourUnitDataRepository.getHourlyEmissions.mockResolvedValue(
        'list of emissions',
      );
      map.many.mockReturnValue('mapped DTOs');

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

      let paginatedFilters = filters;
      paginatedFilters.page = 1;
      paginatedFilters.perPage = 10;

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

    it('calls HourUnitDataRepository.getHourlyEmissions() with filters for controlTechnologies', async () => {
      hourUnitDataRepository.getHourlyEmissions.mockResolvedValue([entity]);
      map.many.mockReturnValue('mapped DTOs');

      filters.controlTechnologies = ControlTechnology.ADDITIVES_TO_ENHANCE;

      let result = await hourlyApportionedEmissionsService.getHourlyEmissions(
        filters,
      );
      expect(hourUnitDataRepository.getHourlyEmissions).toHaveBeenCalledWith(
        filters,
      );
      expect(map.many).toHaveBeenCalled();
      expect(result).toEqual('mapped DTOs');
    });
  });
});
