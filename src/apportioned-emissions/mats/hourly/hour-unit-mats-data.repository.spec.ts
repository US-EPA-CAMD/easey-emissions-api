import { Test } from '@nestjs/testing';
import {
  ControlTechnology,
  State,
  UnitFuelType,
  UnitType,
} from '@us-epa-camd/easey-common/enums';
import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { ApplicableMatsApportionedEmissionsAttributesParamsDTO } from '../../../dto/applicable-mats-apportioned-emissions-attributes-params.dto';
import { PaginatedHourlyMatsApportionedEmissionsParamsDTO } from '../../../dto/hourly-mats-apporitioned-emissions.params.dto';
import { QueryBuilderHelper } from '../../../utils/query-builder.helper';
import { HourUnitMatsDataView } from './../../../entities/vw-hour-unit-mats-data.entity';
import { HourUnitMatsDataRepository } from './hour-unit-mats-data.repository';

jest.mock('../../../utils/query-builder.helper');

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
  getManyAndCount: jest.fn(),
  select: jest.fn(),
  orderBy: jest.fn(),
  addOrderBy: jest.fn(),
  skip: jest.fn(),
  take: jest.fn(),
  getQueryAndParameters: jest.fn().mockResolvedValue('mockEmissions'),
});

let filters = new PaginatedHourlyMatsApportionedEmissionsParamsDTO();
filters.page = undefined;
filters.perPage = undefined;
filters.beginDate = new Date();
filters.endDate = new Date();
filters.stateCode = [State.TX];
filters.facilityId = [3];
filters.unitType = [UnitType.BUBBLING_FLUIDIZED, UnitType.ARCH_FIRE_BOILER];
filters.unitFuelType = [UnitFuelType.COAL, UnitFuelType.DIESEL_OIL];
filters.controlTechnologies = [
  ControlTechnology.ADDITIVES_TO_ENHANCE,
  ControlTechnology.OTHER,
];
filters.operatingHoursOnly = true;

describe('HourUnitMatsDataRepository', () => {
  let repository: HourUnitMatsDataRepository;
  let queryBuilder: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HourUnitMatsDataRepository,
        {
          provide: EntityManager,
          useFactory: () => ({
            getRepository: jest.fn().mockReturnValue({
              createQueryBuilder: jest.fn().mockImplementation(() => ({
                subQuery: jest.fn().mockReturnThis() as unknown,
                from: jest.fn().mockReturnThis() as unknown,
                where: jest.fn().mockReturnThis() as unknown,
                select: jest.fn().mockReturnThis() as unknown,
                getQuery: jest.fn().mockReturnThis() as unknown,
                setParameter: jest.fn().mockReturnThis() as unknown,
                andWhere: jest.fn().mockReturnThis() as unknown,
                innerJoin: jest.fn().mockReturnThis() as unknown,
                distinctOn: jest.fn().mockReturnThis() as unknown,
                getMany: jest
                  .fn()
                  .mockResolvedValue(new HourUnitMatsDataView()) as unknown,
                getRawMany: jest.fn().mockResolvedValue([]) as unknown,
              })),
            }),
            query: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: SelectQueryBuilder,
          useFactory: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get(HourUnitMatsDataRepository);
    queryBuilder = module.get(SelectQueryBuilder);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();

    QueryBuilderHelper.createEmissionsQuery = jest
      .fn()
      .mockReturnValue(queryBuilder);

    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);
    queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
    queryBuilder.skip.mockReturnValue(queryBuilder);
    queryBuilder.take.mockReturnValue('mockPagination');
    queryBuilder.getMany.mockReturnValue('mockMatsEmissions');
    queryBuilder.getManyAndCount.mockReturnValue(['mockMatsEmissions', 0]);

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('getEmissions', () => {
    it('calls createQueryBuilder and gets all HourUnitMatsData from the repository no filters', async () => {
      const result = await repository.getEmissions(
        req,
        new PaginatedHourlyMatsApportionedEmissionsParamsDTO(),
      );

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockMatsEmissions');
    });

    it('calls createQueryBuilder and gets HourUnitMatsData from the repository with filters', async () => {
      const result = await repository.getEmissions(req, filters);
      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockMatsEmissions');
    });

    it('calls createQueryBuilder and gets all HourUnitMatsData from the repository with pagination', async () => {
      ResponseHeaders.setPagination = jest
        .fn()
        .mockReturnValue('paginated results');

      let paginatedFilters = filters;
      paginatedFilters.page = 1;
      paginatedFilters.perPage = 10;

      const paginatedResult = await repository.getEmissions(
        req,
        paginatedFilters,
      );

      expect(ResponseHeaders.setPagination).toHaveBeenCalled();
      expect(paginatedResult).toEqual('mockMatsEmissions');
    });
  });

  describe('getApplicableEmissions', () => {
    it('runs successfully and returns a mocked value of []', async () => {
      let result = await repository.getApplicableEmissions(
        new ApplicableMatsApportionedEmissionsAttributesParamsDTO(),
        true,
        true,
      );
      expect(result).toEqual([]);

      result = await repository.getApplicableEmissions(
        new ApplicableMatsApportionedEmissionsAttributesParamsDTO(),
        true,
        false,
      );
      expect(result).toEqual([]);
    });
  });
});
