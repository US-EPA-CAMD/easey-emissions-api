import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import {
  State,
  UnitType,
  UnitFuelType,
  ControlTechnology,
  Program,
} from '@us-epa-camd/easey-common/enums';
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

let filters: OzoneApportionedEmissionsParamsDTO = new OzoneApportionedEmissionsParamsDTO();
  filters.page = undefined;
  filters.perPage = undefined;
  filters.year = [2019];
  filters.state = [State.TX];
  filters.facilityId = [3];
  filters.unitType = [UnitType.BUBBLING_FLUIDIZED, UnitType.ARCH_FIRE_BOILER];
  filters.unitFuelType = [UnitFuelType.COAL, UnitFuelType.DIESEL_OIL];
  filters.controlTechnologies = [
    ControlTechnology.ADDITIVES_TO_ENHANCE,
    ControlTechnology.OTHER,
  ];
  filters.programCodeInfo = [Program.ARP, Program.RGGI];

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
