import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource, EntityManager } from 'typeorm';

import {
  genDailyApportionedEmissionsFacilityDto,
  genDailyApportionedEmissionsNationalDto,
  genDailyApportionedEmissionsStateDto,
  genDayUnitData,
} from '../../../test/object-generators/apportioned-emissions';
import { PaginatedDailyApportionedEmissionsParamsDTO } from '../../dto/daily-apportioned-emissions.params.dto';
import { DayUnitDataView } from '../../entities/vw-day-unit-data.entity';
import { DailyApportionedEmissionsController } from './daily-apportioned-emissions.controller';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';
import { DayUnitDataRepository } from './day-unit-data.repository';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Daily Apportioned Emissions Controller --', () => {
  let controller: DailyApportionedEmissionsController;
  let service: DailyApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [DailyApportionedEmissionsController],
      providers: [
        DayUnitDataRepository,
        DailyApportionedEmissionsService,
        EntityManager,
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

    controller = module.get(DailyApportionedEmissionsController);
    service = module.get(DailyApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getEmissions', () => {
    it('calls DailyApportionedEmissionsService.getEmissions() and returns all emissions data', async () => {
      const dailyList = genDayUnitData<DayUnitDataView>();
      const mockedValues = {
        items: dailyList
      }
      const paramsDto = new PaginatedDailyApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'getEmissions').mockResolvedValue(dailyList);
      expect(await controller.getEmissions(req, paramsDto)).toEqual(mockedValues);
    });
  });

  describe('* getEmissionsFacilityAggregation', () => {
    it('calls DailyApportionedEmissionsService.getEmissionsFacilityAggregation() and gets all emissions data', async () => {
      const byFacilityList = genDailyApportionedEmissionsFacilityDto();
      const mockedValues = {
        items: byFacilityList
      }
      const paramsDto = new PaginatedDailyApportionedEmissionsParamsDTO();
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
    it('calls DailyApportionedEmissionsService.getEmissionsStateAggregation() and gets all emissions data', async () => {
      const byStateList = genDailyApportionedEmissionsStateDto();
      const mockedValues = {
        items: byStateList
      }
      const paramsDto = new PaginatedDailyApportionedEmissionsParamsDTO();
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
    it('calls DailyApportionedEmissionsService.getEmissionsNationalAggregation() and gets all emissions data', async () => {
      const nationlityList = genDailyApportionedEmissionsNationalDto();
      const mockedValues = {
        items: nationlityList
      }
      const paramsDto = new PaginatedDailyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissionsNationalAggregation')
        .mockResolvedValue(nationlityList);
      const results = await controller.getEmissionsNationalAggregation(
        req,
        paramsDto,
      );
      expect(results).toEqual(mockedValues);
    });
  });
});
