import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { ApportionedEmissionsParamsDTO } from '../dto/apportioned-emissions.params.dto';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DayUnitData } from '../entities/day-unit-data.entity';
import { State } from '../enums/state.enum';
import { UnitType } from '../enums/unit-type.enum';
import { UnitFuelType } from '../enums/unit-fuel-type.enum';
import { ControlTechnology } from '../enums/control-technology.enum';
import { Program } from '../enums/program.enum';
import { ResponseHeaders } from '../utils/response.headers';

const mockQueryBuilder = () => ({
  andWhere: jest.fn(),
  getMany: jest.fn(),
  select: jest.fn(),
  innerJoin: jest.fn(),
  orderBy: jest.fn(),
  addOrderBy: jest.fn(),
  getCount: jest.fn(),
  skip: jest.fn(),
  take: jest.fn(),
});

let filters: ApportionedEmissionsParamsDTO = {
  page: undefined,
  perPage: undefined,
  state: [State.TX],
  facilityId: [3],
  unitType: [UnitType.BUBBLING_FLUIDIZED, UnitType.ARCH_FIRE_BOILER],
  unitFuelType: [UnitFuelType.COAL, UnitFuelType.DIESEL_OIL],
  controlTechnologies: [
    ControlTechnology.ADDITIVES_TO_ENHANCE,
    ControlTechnology.OTHER,
  ],
  program: [Program.ARP, Program.RGGI],
};

describe('DayUnitDataRepository', () => {
  let dayUnitDataRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DayUnitDataRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    dayUnitDataRepository = module.get<DayUnitDataRepository>(
      DayUnitDataRepository,
    );
    queryBuilder = module.get<SelectQueryBuilder<DayUnitData>>(
      SelectQueryBuilder,
    );

    dayUnitDataRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(queryBuilder);
    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);
    queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
    queryBuilder.skip.mockReturnValue(queryBuilder);
    queryBuilder.take.mockReturnValue('mockPagination');
    queryBuilder.getCount.mockReturnValue('mockCount');
    queryBuilder.getMany.mockReturnValue('mockEmissions');
  });

  describe('getDailyEmissions', () => {
    it('calls createQueryBuilder and gets all DayUnitData from the repository', async () => {
      // branch coverage
      const emptyFilters: ApportionedEmissionsParamsDTO = new ApportionedEmissionsParamsDTO();
      let result = await dayUnitDataRepository.getDailyEmissions(emptyFilters);

      result = await dayUnitDataRepository.getDailyEmissions(filters);

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });

    it('calls createQueryBuilder and gets all DayUnitData paginated results from the repository', async () => {
      ResponseHeaders.setPagination = jest
        .fn()
        .mockReturnValue('paginated results');

      let paginatedFilters = filters;
      paginatedFilters.page = 1;
      paginatedFilters.perPage = 10;

      const paginatedResult = await dayUnitDataRepository.getDailyEmissions(
        paginatedFilters,
      );

      expect(ResponseHeaders.setPagination).toHaveBeenCalled();
      expect(paginatedResult).toEqual('mockEmissions');
    });
  });
});
