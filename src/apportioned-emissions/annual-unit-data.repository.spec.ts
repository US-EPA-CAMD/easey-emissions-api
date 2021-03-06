import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { State } from '../enums/state.enum';
import { UnitType } from '../enums/unit-type.enum';
import { UnitFuelType } from '../enums/unit-fuel-type.enum';
import { ControlTechnology } from '../enums/control-technology.enum';
import { Program } from '../enums/program.enum';
import { ResponseHeaders } from '../utils/response.headers';
import { AnnualApportionedEmissionsParamsDTO } from '../dto/annual-apportioned-emissions.params.dto';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualUnitData } from '../entities/annual-unit-data.entity';

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

let filters: AnnualApportionedEmissionsParamsDTO = {
  page: undefined,
  perPage: undefined,
  opYear: [2019],
  state: [State.TX],
  orisCode: [3],
  unitType: [UnitType.BUBBLING_FLUIDIZED],
  unitFuelType: [UnitFuelType.COAL, UnitFuelType.DIESEL_OIL],
  controlTechnologies: [
    ControlTechnology.ADDITIVES_TO_ENHANCE,
    ControlTechnology.OTHER,
  ],
  program: [Program.ARP, Program.RGGI],
};

describe('AnnualUnitDataRepository', () => {
  let annualUnitDataRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AnnualUnitDataRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    annualUnitDataRepository = module.get<AnnualUnitDataRepository>(
      AnnualUnitDataRepository,
    );
    queryBuilder = module.get<SelectQueryBuilder<AnnualUnitData>>(
      SelectQueryBuilder,
    );

    annualUnitDataRepository.createQueryBuilder = jest
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

  describe('getAnnualEmissions', () => {
    it('calls createQueryBuilder and gets all AnnualUnitData from the repository', async () => {
      // branch coverage
      const emptyFilters: AnnualApportionedEmissionsParamsDTO = new AnnualApportionedEmissionsParamsDTO();
      let result = await annualUnitDataRepository.getAnnualEmissions(
        emptyFilters,
      );

      result = await annualUnitDataRepository.getAnnualEmissions(filters);

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });

    it('calls createQueryBuilder and gets all AnnualUnitData paginated results from the repository', async () => {
      ResponseHeaders.setPagination = jest
        .fn()
        .mockReturnValue('paginated results');

      let paginatedFilters = filters;
      paginatedFilters.page = 1;
      paginatedFilters.perPage = 10;

      const paginatedResult = await annualUnitDataRepository.getAnnualEmissions(
        paginatedFilters,
      );

      expect(ResponseHeaders.setPagination).toHaveBeenCalled();
      expect(paginatedResult).toEqual('mockEmissions');
    });
  });
});
