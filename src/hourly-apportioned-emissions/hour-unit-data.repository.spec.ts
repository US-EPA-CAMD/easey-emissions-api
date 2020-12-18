import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourUnitData } from '../entities/hour-unit-data.entity';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { State } from '../enums/state.enum';
import { UnitType } from '../enums/unit-type.enum';
import { UnitFuelType } from '../enums/unit-fuel-type.enum';
import { ControlTechnology } from '../enums/control-technology.enum';

const mockQueryBuilder = () => ({
  andWhere: jest.fn(),
  getMany: jest.fn(),
  select: jest.fn(),
  innerJoin: jest.fn(),
});

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
  });

  describe('getHourlyEmissions', () => {
    it('calls createQueryBuilder and gets all HourUnitData from the repository', async () => {
      hourUnitDataRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.select.mockReturnValue(queryBuilder);
      queryBuilder.innerJoin.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue('mockFilter');
      queryBuilder.getMany.mockReturnValue('mockEmissions');

      const filters: HourlyApportionedEmissionsParamsDTO = {
        page: 1,
        perPage: 10,
        orderBy: undefined,
        beginDate: new Date(),
        endDate: new Date(),
        state: State.TX,
        orisCode: 3,
        unitType: UnitType.BUBBLING_FLUIDIZED,
        unitFuelType: UnitFuelType.COAL,
        controlTechnologies: ControlTechnology.ADDITIVES_TO_ENHANCE,
        opHoursOnly: false,
      };
      const result = await hourUnitDataRepository.getHourlyEmissions(filters);

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });
  });
});
