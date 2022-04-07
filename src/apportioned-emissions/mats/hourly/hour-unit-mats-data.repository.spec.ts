import { HourUnitMatsDataView } from './../../../entities/vw-hour-unit-mats-data.entity';
import { Test } from '@nestjs/testing';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  State,
  UnitType,
  UnitFuelType,
  ControlTechnology,
  ExcludeHourlyMatsApportionedEmissions,
} from '@us-epa-camd/easey-common/enums';
import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';
import * as typeorm_functions from 'typeorm/globals';

import {
  PaginatedHourlyMatsApportionedEmissionsParamsDTO,
  StreamHourlyMatsApportionedEmissionsParamsDTO,
} from '../../../dto/hourly-mats-apporitioned-emissions.params.dto';
import { HourUnitMatsDataRepository } from './hour-unit-mats-data.repository';
import { QueryBuilderHelper } from '../../../utils/query-builder.helper';

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
  stream: jest.fn(),
});

jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue(({
  createQueryBuilder: jest.fn().mockImplementation(() => ({
    subQuery: jest.fn().mockReturnThis() as unknown,
    from: jest.fn().mockReturnThis() as unknown,
    where: jest.fn().mockReturnThis() as unknown,
    select: jest.fn().mockReturnThis() as unknown,
    getQuery: jest.fn().mockReturnThis() as unknown,
    setParameter: jest.fn().mockReturnThis() as unknown,
    getMany: jest.fn().mockResolvedValue(new HourUnitMatsDataView()) as unknown,
  })),
} as unknown) as Repository<unknown>);

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

let streamFilters = new StreamHourlyMatsApportionedEmissionsParamsDTO();
filters.beginDate = new Date();
filters.endDate = new Date();
streamFilters.stateCode = [State.TX];
streamFilters.facilityId = [3];
streamFilters.unitType = [
  UnitType.BUBBLING_FLUIDIZED,
  UnitType.ARCH_FIRE_BOILER,
];
streamFilters.unitFuelType = [UnitFuelType.COAL, UnitFuelType.DIESEL_OIL];
streamFilters.controlTechnologies = [
  ControlTechnology.ADDITIVES_TO_ENHANCE,
  ControlTechnology.OTHER,
];
streamFilters.exclude = [
  ExcludeHourlyMatsApportionedEmissions.HCL_INPUT_RATE,
  ExcludeHourlyMatsApportionedEmissions.SECONDARY_FUEL_TYPE,
];

describe('HourUnitMatsDataRepository', () => {
  let repository: HourUnitMatsDataRepository;
  let queryBuilder: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HourUnitMatsDataRepository,
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
    queryBuilder.stream.mockReturnValue('mockEmissions');

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

  describe('streamEmissions', () => {
    it('calls streamEmissions and streams HourUnitMatsData from the repository', async () => {
      const result = repository.getStreamQuery(streamFilters);

      expect(queryBuilder.stream).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });
  });
});
