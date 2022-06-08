import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import {
  State,
  UnitType,
  UnitFuelType,
  ControlTechnology,
  Program,
} from '@us-epa-camd/easey-common/enums';

import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { fieldMappings } from './../../constants/field-mappings';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { PaginatedMonthlyApportionedEmissionsParamsDTO } from '../../dto/monthly-apportioned-emissions.params.dto';

jest.mock('../../utils/query-builder.helper');

const mockRequest = (url?: string, page?: number, perPage?: number) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
    query: {
      page,
      perPage,
    },
  };
};

const mockQueryBuilder = () => ({
  andWhere: jest.fn(),
  getMany: jest.fn(),
  getRawMany: jest.fn(),
  getRawOne: jest.fn(),
  getManyAndCount: jest.fn(),
  select: jest.fn(),
  addSelect: jest.fn(),
  innerJoin: jest.fn(),
  orderBy: jest.fn(),
  addOrderBy: jest.fn(),
  addGroupBy: jest.fn(),
  getCount: jest.fn(),
  skip: jest.fn(),
  take: jest.fn(),
  getQueryAndParameters: jest.fn().mockResolvedValue('mockEmissions'),
});

let filters = new PaginatedMonthlyApportionedEmissionsParamsDTO();
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
  let repository: MonthUnitDataRepository;
  let queryBuilder: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MonthUnitDataRepository,
        {
          provide: SelectQueryBuilder,
          useFactory: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get(MonthUnitDataRepository);
    queryBuilder = module.get(SelectQueryBuilder);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();

    QueryBuilderHelper.createEmissionsQuery = jest
      .fn()
      .mockReturnValue(queryBuilder);

    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.addSelect.mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);
    queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
    queryBuilder.addGroupBy.mockReturnValue(queryBuilder);
    queryBuilder.skip.mockReturnValue(queryBuilder);
    queryBuilder.take.mockReturnValue('mockPagination');
    queryBuilder.getCount.mockReturnValue('mockCount');
    queryBuilder.getMany.mockReturnValue('mockEmissions');
    queryBuilder.getRawMany.mockReturnValue('mockRawEmissions');
    queryBuilder.getRawOne.mockReturnValue('mockRawEmissions');
    queryBuilder.getManyAndCount.mockReturnValue(['mockEmissions', 0]);

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('getEmissions', () => {
    it('calls createQueryBuilder and gets all MonthUnitData from the repository no filters', async () => {
      const result = await repository.getEmissions(
        req,
        fieldMappings.emissions.monthly.data.aggregation.unit,
        new PaginatedMonthlyApportionedEmissionsParamsDTO(),
      );

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });

    it('calls createQueryBuilder and gets MonthUnitData from the repository with filters', async () => {
      const result = await repository.getEmissions(
        req,
        fieldMappings.emissions.monthly.data.aggregation.unit,
        filters
      );
      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });

    it('calls createQueryBuilder and gets all MonthUnitData from the repository with pagination', async () => {
      ResponseHeaders.setPagination = jest
        .fn()
        .mockReturnValue('paginated results');

      let paginatedFilters = filters;
      paginatedFilters.page = 1;
      paginatedFilters.perPage = 10;

      const paginatedResult = await repository.getEmissions(
        req,
        fieldMappings.emissions.monthly.data.aggregation.unit,
        paginatedFilters,
      );

      expect(ResponseHeaders.setPagination).toHaveBeenCalled();
      expect(paginatedResult).toEqual('mockEmissions');
    });
  });

  describe('getEmissionsFacilityAggregation', () => {
    it('calls createQueryBuilder and gets all MonthUnitData aggregated by facility from the repository with no filters', async () => {
      const result = await repository.getEmissionsFacilityAggregation(
        req,
        new PaginatedMonthlyApportionedEmissionsParamsDTO(),
      );

      expect(queryBuilder.getRawMany).toHaveBeenCalled();
      expect(queryBuilder.getRawOne).not.toHaveBeenCalled();
      expect(result).toEqual('mockRawEmissions');
    });

    it('calls createQueryBuilder and gets MonthUnitData aggregated by facility from the repository with filters', async () => {
      const result = await repository.getEmissionsFacilityAggregation(
        req,
        filters,
      );
      expect(queryBuilder.getRawMany).toHaveBeenCalled();
      expect(queryBuilder.getRawOne).toHaveBeenCalled();
      expect(result).toEqual('mockRawEmissions');
    });

    it('calls createQueryBuilder and gets all MonthUnitData aggregated by facility from the repository with pagination', async () => {
      ResponseHeaders.setPagination = jest
        .fn()
        .mockReturnValue('paginated results');

      let paginatedFilters = filters;
      paginatedFilters.page = 1;
      paginatedFilters.perPage = 10;

      const paginatedResult = await repository.getEmissionsFacilityAggregation(
        req,
        paginatedFilters,
      );

      expect(ResponseHeaders.setPagination).toHaveBeenCalled();
      expect(paginatedResult).toEqual('mockRawEmissions');
    });
  });

  describe('getEmissionsStateAggregation', () => {
    it('calls createQueryBuilder and gets all MonthUnitData aggregated by state from the repository with no filters', async () => {
      const result = await repository.getEmissionsStateAggregation(
        req,
        new PaginatedMonthlyApportionedEmissionsParamsDTO(),
      );

      expect(queryBuilder.getRawMany).toHaveBeenCalled();
      expect(queryBuilder.getRawOne).not.toHaveBeenCalled();

      expect(result).toEqual('mockRawEmissions');
    });

    it('calls createQueryBuilder and gets MonthUnitData aggregated by state from the repository with filters', async () => {
      const result = await repository.getEmissionsStateAggregation(
        req,
        filters,
      );
      expect(queryBuilder.getRawMany).toHaveBeenCalled();
      expect(queryBuilder.getRawOne).toHaveBeenCalled();
      expect(result).toEqual('mockRawEmissions');
    });

    it('calls createQueryBuilder and gets all MonthUnitData aggregated by state from the repository with pagination', async () => {
      ResponseHeaders.setPagination = jest
        .fn()
        .mockReturnValue('paginated results');

      let paginatedFilters = filters;
      paginatedFilters.page = 1;
      paginatedFilters.perPage = 10;

      const paginatedResult = await repository.getEmissionsStateAggregation(
        req,
        paginatedFilters,
      );

      expect(ResponseHeaders.setPagination).toHaveBeenCalled();
      expect(paginatedResult).toEqual('mockRawEmissions');
    });
  });

  describe('getEmissionsNationalAggregation', () => {
    it('calls createQueryBuilder and gets all MonthUnitData aggregated nationally from the repository with no filters', async () => {
      const result = await repository.getEmissionsNationalAggregation(
        req,
        new PaginatedMonthlyApportionedEmissionsParamsDTO(),
      );

      expect(queryBuilder.getRawMany).toHaveBeenCalled();
      expect(queryBuilder.getRawOne).not.toHaveBeenCalled();
      expect(result).toEqual('mockRawEmissions');
    });

    it('calls createQueryBuilder and gets MonthUnitData aggregated nationally from the repository with filters', async () => {
      const result = await repository.getEmissionsNationalAggregation(
        req,
        filters,
      );
      expect(queryBuilder.getRawMany).toHaveBeenCalled();
      expect(queryBuilder.getRawOne).toHaveBeenCalled();
      expect(result).toEqual('mockRawEmissions');
    });

    it('calls createQueryBuilder and gets all MonthUnitData aggregated nationally from the repository with pagination', async () => {
      ResponseHeaders.setPagination = jest
        .fn()
        .mockReturnValue('paginated results');

      let paginatedFilters = filters;
      paginatedFilters.page = 1;
      paginatedFilters.perPage = 10;

      const paginatedResult = await repository.getEmissionsNationalAggregation(
        req,
        paginatedFilters,
      );

      expect(ResponseHeaders.setPagination).toHaveBeenCalled();
      expect(paginatedResult).toEqual('mockRawEmissions');
    });
  });
});
