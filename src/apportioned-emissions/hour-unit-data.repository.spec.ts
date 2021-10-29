import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import {
  State,
  UnitType,
  UnitFuelType,
  ControlTechnology,
  Program,
} from '@us-epa-camd/easey-common/enums';

import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { HourUnitData } from '../entities/hour-unit-data.entity';
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

let filters: HourlyApportionedEmissionsParamsDTO = {
  page: undefined,
  perPage: undefined,
  beginDate: new Date(),
  endDate: new Date(),
  state: [State.TX],
  facilityId: [3],
  unitType: [UnitType.BUBBLING_FLUIDIZED, UnitType.ARCH_FIRE_BOILER],
  unitFuelType: [UnitFuelType.COAL, UnitFuelType.DIESEL_OIL],
  controlTechnologies: [
    ControlTechnology.ADDITIVES_TO_ENHANCE,
    ControlTechnology.OTHER,
  ],
  programCodeInfo: [Program.ARP, Program.RGGI],
  operatingHoursOnly: true,
};

describe('HourUnitDataRepository', () => {
  let hourUnitDataRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HourUnitDataRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    hourUnitDataRepository = module.get<HourUnitDataRepository>(
      HourUnitDataRepository,
    );
    queryBuilder = module.get<SelectQueryBuilder<HourUnitData>>(
      SelectQueryBuilder,
    );

    hourUnitDataRepository.createQueryBuilder = jest
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

  describe('getHourlyEmissions', () => {
    it('calls createQueryBuilder and gets all HourUnitData from the repository', async () => {
      // branch coverage
      const emptyFilters: HourlyApportionedEmissionsParamsDTO = new HourlyApportionedEmissionsParamsDTO();
      let result = await hourUnitDataRepository.getHourlyEmissions(
        emptyFilters,
      );

      result = await hourUnitDataRepository.getHourlyEmissions(filters);

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });

    it('calls createQueryBuilder and gets all HourUnitData paginated results from the repository', async () => {
      ResponseHeaders.setPagination = jest
        .fn()
        .mockReturnValue('paginated results');

      let paginatedFilters = filters;
      paginatedFilters.page = 1;
      paginatedFilters.perPage = 10;

      const paginatedResult = await hourUnitDataRepository.getHourlyEmissions(
        paginatedFilters,
      );

      expect(ResponseHeaders.setPagination).toHaveBeenCalled();
      expect(paginatedResult).toEqual('mockEmissions');
    });
  });
});
