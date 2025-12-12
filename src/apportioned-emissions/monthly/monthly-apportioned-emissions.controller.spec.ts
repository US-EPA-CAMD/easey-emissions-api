import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource, EntityManager } from 'typeorm';

import {
  genMonthlyApportionedEmissionsFacilityDto,
  genMonthlyApportionedEmissionsNationalDto,
  genMonthlyApportionedEmissionsStateDto,
  genMonthUnitData,
} from '../../../test/object-generators/apportioned-emissions';
import { PaginatedMonthlyApportionedEmissionsParamsDTO } from '../../dto/monthly-apportioned-emissions.params.dto';
import { MonthUnitDataView } from '../../entities/vw-month-unit-data.entity';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsController } from './monthly-apportioned-emissions.controller';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Monthly Apportioned Emissions Controller --', () => {
  let controller: MonthlyApportionedEmissionsController;
  let service: MonthlyApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [MonthlyApportionedEmissionsController],
      providers: [
        EntityManager,
        MonthlyApportionedEmissionsService,
        MonthUnitDataRepository,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              isReleased: false,
            }),
          },
        }
      ],
    }).compile();

    controller = module.get(MonthlyApportionedEmissionsController);
    service = module.get(MonthlyApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getEmissions', () => {
    it('calls MonthlyApportionedEmissionsService.getEmissions() and returns all emissions data', async () => {
      const monthlyList = genMonthUnitData<MonthUnitDataView>();
      const mockedValues = {
        items: monthlyList
      }
      const paramsDto = new PaginatedMonthlyApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'getEmissions').mockResolvedValue(monthlyList);
      expect(await controller.getEmissions(req, paramsDto)).toEqual(mockedValues);
    });
  });

  describe('* getEmissionsFacilityAggregation', () => {
    it('calls MonthlyApportionedEmissionsService.getEmissionsFacilityAggregation() and gets all emissions data', async () => {
      const byFacilityList = genMonthlyApportionedEmissionsFacilityDto();
      const mockedValues = {
        items: byFacilityList
      }
      const paramsDto = new PaginatedMonthlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissionsFacilityAggregation')
        .mockResolvedValue(byFacilityList);
      const results = await controller.getEmissionsFacilityAggregation(
        req,
        paramsDto,
      );
      expect(results).toEqual(mockedValues);
    });
  });

  describe('* getEmissionsStateAggregation', () => {
    it('calls MonthlyApportionedEmissionsService.getEmissionsStateAggregation() and gets all emissions data', async () => {
      const byStateList = genMonthlyApportionedEmissionsStateDto();
      const mockedValues = {
        items: byStateList
      }
      const paramsDto = new PaginatedMonthlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissionsStateAggregation')
        .mockResolvedValue(byStateList);
      const results = await controller.getEmissionsStateAggregation(
        req,
        paramsDto,
      );
      expect(results).toEqual(mockedValues);
    });
  });

  describe('* getEmissionsNationalAggregation', () => {
    it('calls MonthlyApportionedEmissionsService.getEmissionsNationalAggregation() and gets all emissions data', async () => {
      const nationallyList = genMonthlyApportionedEmissionsNationalDto();
      const mockedValues = {
        items: nationallyList
      }
      const paramsDto = new PaginatedMonthlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissionsNationalAggregation')
        .mockResolvedValue(nationallyList);
      const results = await controller.getEmissionsNationalAggregation(
        req,
        paramsDto,
      );
      expect(results).toEqual(mockedValues);
    });
  });
});
