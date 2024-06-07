import { Test } from '@nestjs/testing';
import {
  ControlTechnology,
  Program,
  State,
  UnitFuelType,
  UnitType,
} from '@us-epa-camd/easey-common/enums';
import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { PaginatedOzoneApportionedEmissionsParamsDTO } from '../../dto/ozone-apportioned-emissions.params.dto';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import { fieldMappings } from './../../constants/field-mappings';
import { OzoneUnitDataRepository } from './ozone-unit-data.repository';

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
  innerJoin: jest.fn(),
  orderBy: jest.fn(),
  addOrderBy: jest.fn(),
  addSelect: jest.fn(),
  addGroupBy: jest.fn(),
  getCount: jest.fn(),
  skip: jest.fn(),
  take: jest.fn(),
  getQueryAndParameters: jest.fn().mockResolvedValue('mockEmissions'),
});

let filters = new PaginatedOzoneApportionedEmissionsParamsDTO();
filters.page = undefined;
filters.perPage = undefined;
filters.year = [2019];
filters.stateCode = [State.TX];
filters.facilityId = [3];
filters.unitType = [UnitType.BUBBLING_FLUIDIZED, UnitType.ARCH_FIRE_BOILER];
filters.unitFuelType = [UnitFuelType.COAL, UnitFuelType.DIESEL_OIL];
filters.controlTechnologies = [
  ControlTechnology.ADDITIVES_TO_ENHANCE,
  ControlTechnology.OTHER,
];
filters.programCodeInfo = [Program.ARP, Program.RGGI];

describe('OzoneUnitDataRepository', () => {
  let repository: OzoneUnitDataRepository;
  let queryBuilder: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        OzoneUnitDataRepository,
        {
          provide: SelectQueryBuilder,
          useFactory: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get(OzoneUnitDataRepository);
    queryBuilder = module.get(SelectQueryBuilder);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();

    QueryBuilderHelper.createEmissionsQuery = jest
      .fn()
      .mockReturnValue(queryBuilder);

    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);
    queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
    queryBuilder.addSelect.mockReturnValue(queryBuilder);
    queryBuilder.addGroupBy.mockReturnValue(queryBuilder);
    queryBuilder.skip.mockReturnValue(queryBuilder);
    queryBuilder.take.mockReturnValue('mockPagination');
    queryBuilder.getCount.mockReturnValue('mockCount');
    queryBuilder.getMany.mockReturnValue('mockEmissions');
    queryBuilder.getRawMany.mockReturnValue('mockRawEmissions');
    queryBuilder.getRawOne.mockReturnValue('mockRawCount');
    queryBuilder.getManyAndCount.mockReturnValue(['mockEmissions', 0]);

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('getEmissions', () => {
    it('calls createQueryBuilder and gets all OzoneUnitData from the repository no filters', async () => {
      const result = await repository.getEmissions(
        req,
        fieldMappings.emissions.ozone.data.aggregation.unit,
        new PaginatedOzoneApportionedEmissionsParamsDTO(),
      );

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });

    it('calls createQueryBuilder and gets OzoneUnitData from the repository with filters', async () => {
      const result = await repository.getEmissions(
        req,
        fieldMappings.emissions.ozone.data.aggregation.unit,
        filters,
      );
      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });

    it('calls createQueryBuilder and gets all OzoneUnitData from the repository with pagination', async () => {
      ResponseHeaders.setPagination = jest
        .fn()
        .mockReturnValue('paginated results');

      let paginatedFilters = filters;
      paginatedFilters.page = 1;
      paginatedFilters.perPage = 10;

      const paginatedResult = await repository.getEmissions(
        req,
        fieldMappings.emissions.ozone.data.aggregation.unit,
        paginatedFilters,
      );

      expect(ResponseHeaders.setPagination).toHaveBeenCalled();
      expect(paginatedResult).toEqual('mockEmissions');
    });
  });

  describe('getEmissionsFacilityAggregation', () => {
    it('calls createQueryBuilder and gets all OzoneUnitData aggregated by facility from the repository no filters', async () => {
      const result = await repository.getEmissionsFacilityAggregation(
        req,
        new PaginatedOzoneApportionedEmissionsParamsDTO(),
      );

      expect(queryBuilder.getRawMany).toHaveBeenCalled();
      expect(result).toEqual('mockRawEmissions');
    });

    it('calls createQueryBuilder and gets OzoneUnitData aggregated by facility from the repository with filters', async () => {
      const result = await repository.getEmissionsFacilityAggregation(
        req,
        filters,
      );
      expect(queryBuilder.getRawMany).toHaveBeenCalled();
      expect(result).toEqual('mockRawEmissions');
    });

    it('calls createQueryBuilder and gets all OzoneUnitData aggregated by facility from the repository with pagination', async () => {
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
      expect(queryBuilder.getRawOne).toHaveBeenCalled();
      expect(paginatedResult).toEqual('mockRawEmissions');
    });
  });

  describe('getEmissionsStateAggregation', () => {
    it('calls createQueryBuilder and gets all OzoneUnitData aggregated by state from the repository no filters', async () => {
      const result = await repository.getEmissionsStateAggregation(
        req,
        new PaginatedOzoneApportionedEmissionsParamsDTO(),
      );

      expect(queryBuilder.getRawMany).toHaveBeenCalled();
      expect(result).toEqual('mockRawEmissions');
    });

    it('calls createQueryBuilder and gets OzoneUnitData aggregated by state from the repository with filters', async () => {
      const result = await repository.getEmissionsStateAggregation(
        req,
        filters,
      );
      expect(queryBuilder.getRawMany).toHaveBeenCalled();
      expect(result).toEqual('mockRawEmissions');
    });

    it('calls createQueryBuilder and gets all OzoneUnitData aggregated by state from the repository with pagination', async () => {
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
      expect(queryBuilder.getRawOne).toHaveBeenCalled();
      expect(paginatedResult).toEqual('mockRawEmissions');
    });
  });

  describe('getEmissionsNationalAggregation', () => {
    it('calls createQueryBuilder and gets all OzoneUnitData aggregated nationally from the repository no filters', async () => {
      const result = await repository.getEmissionsNationalAggregation(
        req,
        new PaginatedOzoneApportionedEmissionsParamsDTO(),
      );

      expect(queryBuilder.getRawMany).toHaveBeenCalled();
      expect(result).toEqual('mockRawEmissions');
    });

    it('calls createQueryBuilder and gets OzoneUnitData aggregated nationally from the repository with filters', async () => {
      const result = await repository.getEmissionsNationalAggregation(
        req,
        filters,
      );
      expect(queryBuilder.getRawMany).toHaveBeenCalled();
      expect(result).toEqual('mockRawEmissions');
    });

    it('calls createQueryBuilder and gets all OzoneUnitData aggregated nationally from the repository with pagination', async () => {
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
      expect(queryBuilder.getRawOne).toHaveBeenCalled();
      expect(paginatedResult).toEqual('mockRawEmissions');
    });
  });
});
