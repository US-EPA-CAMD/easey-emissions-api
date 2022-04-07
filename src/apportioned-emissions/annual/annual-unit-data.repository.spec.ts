import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import {
  State,
  UnitType,
  UnitFuelType,
  ControlTechnology,
  Program,
  ExcludeApportionedEmissions,
} from '@us-epa-camd/easey-common/enums';
import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import {
  PaginatedAnnualApportionedEmissionsParamsDTO,
  StreamAnnualApportionedEmissionsParamsDTO,
} from '../../dto/annual-apportioned-emissions.params.dto';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
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
  getManyAndCount: jest.fn(),
  select: jest.fn(),
  innerJoin: jest.fn(),
  orderBy: jest.fn(),
  addOrderBy: jest.fn(),
  getCount: jest.fn(),
  skip: jest.fn(),
  take: jest.fn(),
  stream: jest.fn(),
});

let filters = new PaginatedAnnualApportionedEmissionsParamsDTO();
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

let streamFilters = new StreamAnnualApportionedEmissionsParamsDTO();
streamFilters.year = [2019];
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
streamFilters.programCodeInfo = [Program.ARP, Program.RGGI];
streamFilters.exclude = [
  ExcludeApportionedEmissions.CO2_RATE,
  ExcludeApportionedEmissions.COUNT_OP_TIME,
];

describe('AnnualUnitDataRepository', () => {
  let repository: AnnualUnitDataRepository;
  let queryBuilder: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AnnualUnitDataRepository,
        {
          provide: SelectQueryBuilder,
          useFactory: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get(AnnualUnitDataRepository);
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
    queryBuilder.skip.mockReturnValue(queryBuilder);
    queryBuilder.take.mockReturnValue('mockPagination');
    queryBuilder.getCount.mockReturnValue('mockCount');
    queryBuilder.getMany.mockReturnValue('mockEmissions');
    queryBuilder.getManyAndCount.mockReturnValue(['mockEmissions', 0]);
    queryBuilder.stream.mockReturnValue('mockEmissions');

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('getEmissions', () => {
    it('calls createQueryBuilder and gets all AnnualUnitData from the repository no filters', async () => {
      const result = await repository.getEmissions(
        req,
        new PaginatedAnnualApportionedEmissionsParamsDTO(),
      );

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });

    it('calls createQueryBuilder and gets AnnualUnitData from the repository with filters', async () => {
      const result = await repository.getEmissions(req, filters);
      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });

    it('calls createQueryBuilder and gets all AnnualUnitData from the repository with pagination', async () => {
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
      expect(paginatedResult).toEqual('mockEmissions');
    });
  });

  describe('streamEmissions', () => {
    it('calls streamEmissions and streams AnnualUnitData from the repository', async () => {
      const result = repository.getStreamQuery(streamFilters);

      expect(queryBuilder.stream).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });
  });
});
