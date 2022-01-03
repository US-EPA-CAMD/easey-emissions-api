import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import {
  State,
  UnitType,
  UnitFuelType,
  ControlTechnology,
  Program,
} from '@us-epa-camd/easey-common/enums';

import { MonthlyApportionedEmissionsParamsDTO } from '../dto/monthly-apportioned-emissions.params.dto';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthUnitData } from '../entities/month-unit-data.entity';
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

let filters: MonthlyApportionedEmissionsParamsDTO = new MonthlyApportionedEmissionsParamsDTO();
filters.page = undefined;
filters.perPage = undefined;
filters.year = [2019];
filters.month = [1, 2];
filters.stateCode = [State.TX];
filters.facilityId = [3];
filters.unitType = [UnitType.BUBBLING_FLUIDIZED, UnitType.ARCH_FIRE_BOILER];
filters.unitFuelType = [UnitFuelType.COAL, UnitFuelType.DIESEL_OIL];
filters.controlTechnologies = [
  ControlTechnology.ADDITIVES_TO_ENHANCE,
  ControlTechnology.OTHER,
];
filters.programCodeInfo = [Program.ARP, Program.RGGI];

describe('MonthUnitDataRepository', () => {
  let monthUnitDataRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MonthUnitDataRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    monthUnitDataRepository = module.get<MonthUnitDataRepository>(
      MonthUnitDataRepository,
    );
    queryBuilder = module.get<SelectQueryBuilder<MonthUnitData>>(
      SelectQueryBuilder,
    );

    monthUnitDataRepository.createQueryBuilder = jest
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

  describe('getMonthlyEmissions', () => {
    it('calls createQueryBuilder and gets all MonthUnitData from the repository', async () => {
      // branch coverage
      const emptyFilters: MonthlyApportionedEmissionsParamsDTO = new MonthlyApportionedEmissionsParamsDTO();
      let result = await monthUnitDataRepository.getMonthlyEmissions(
        emptyFilters,
      );

      result = await monthUnitDataRepository.getMonthlyEmissions(filters);

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });

    it('calls createQueryBuilder and gets all MonthUnitData paginated results from the repository', async () => {
      ResponseHeaders.setPagination = jest
        .fn()
        .mockReturnValue('paginated results');

      let paginatedFilters = filters;
      paginatedFilters.page = 1;
      paginatedFilters.perPage = 10;

      const paginatedResult = await monthUnitDataRepository.getMonthlyEmissions(
        paginatedFilters,
      );

      expect(ResponseHeaders.setPagination).toHaveBeenCalled();
      expect(paginatedResult).toEqual('mockEmissions');
    });
  });
});
