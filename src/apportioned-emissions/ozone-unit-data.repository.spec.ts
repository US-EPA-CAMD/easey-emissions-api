import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { State } from '../enums/state.enum';
import { UnitType } from '../enums/unit-type.enum';
import { UnitFuelType } from '../enums/unit-fuel-type.enum';
import { ControlTechnology } from '../enums/control-technology.enum';
import { Program } from '../enums/program.enum';
import { ResponseHeaders } from '../utils/response.headers';
import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
import { OzoneApportionedEmissionsParamsDTO } from '../dto/ozone-apportioned-emissions.params.dto';
import { OzoneUnitData } from '../entities/ozone-unit-data.entity';

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

let filters: OzoneApportionedEmissionsParamsDTO = {
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

describe('OzoneUnitDataRepository', () => {
  let ozoneUnitDataRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OzoneUnitDataRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    ozoneUnitDataRepository = module.get<OzoneUnitDataRepository>(
      OzoneUnitDataRepository,
    );
    queryBuilder = module.get<SelectQueryBuilder<OzoneUnitData>>(
      SelectQueryBuilder,
    );

    ozoneUnitDataRepository.createQueryBuilder = jest
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

  describe('getOzoneEmissions', () => {
    it('calls createQueryBuilder and gets all OzoneUnitData from the repository', async () => {
      // branch coverage
      const emptyFilters: OzoneApportionedEmissionsParamsDTO = new OzoneApportionedEmissionsParamsDTO();
      let result = await ozoneUnitDataRepository.getOzoneEmissions(
        emptyFilters,
      );

      result = await ozoneUnitDataRepository.getOzoneEmissions(filters);

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });

    it('calls createQueryBuilder and gets all OzoneUnitData paginated results from the repository', async () => {
      ResponseHeaders.setPagination = jest
        .fn()
        .mockReturnValue('paginated results');

      let paginatedFilters = filters;
      paginatedFilters.page = 1;
      paginatedFilters.perPage = 10;

      const paginatedResult = await ozoneUnitDataRepository.getOzoneEmissions(
        paginatedFilters,
      );

      expect(ResponseHeaders.setPagination).toHaveBeenCalled();
      expect(paginatedResult).toEqual('mockEmissions');
    });
  });
});
