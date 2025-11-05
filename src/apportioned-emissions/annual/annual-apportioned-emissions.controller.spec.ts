import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource, EntityManager } from 'typeorm';

import {
  genAnnualApportionedEmissionsFacilityDto,
  genAnnualApportionedEmissionsNationalDto,
  genAnnualApportionedEmissionsStateDto,
  genAnnualUnitData,
} from '../../../test/object-generators/apportioned-emissions';
import { PaginatedAnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';
import { AnnualUnitDataView } from '../../entities/vw-annual-unit-data.entity';
import { AnnualApportionedEmissionsController } from './annual-apportioned-emissions.controller';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Annual Apportioned Emissions Controller --', () => {
  let controller: AnnualApportionedEmissionsController;
  let service: AnnualApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [AnnualApportionedEmissionsController],
      providers: [
        AnnualApportionedEmissionsService,
        AnnualUnitDataRepository,
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

    controller = module.get(AnnualApportionedEmissionsController);
    service = module.get(AnnualApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getEmissions', () => {
    it('calls AnnualApportionedEmissionsService.getEmissions() and returns all emissions data', async () => {
      const annualList = genAnnualUnitData<AnnualUnitDataView>();
      const mockedValues = {
        items: annualList
      }
      const paramsDto = new PaginatedAnnualApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'getEmissions').mockResolvedValue(annualList);
      expect(await controller.getEmissions(req, paramsDto)).toEqual(mockedValues);
    });
  });

  describe('* getEmissionsFacilityAggregation', () => {
    it('calls AnnualApportionedEmissionsService.getEmissionsFacilityAggregation() and gets all emissions data', async () => {
      const byFacilityList = genAnnualApportionedEmissionsFacilityDto();
      const mockedValues ={
        items: byFacilityList
      }
      const paramsDto = new PaginatedAnnualApportionedEmissionsParamsDTO();
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
    it('calls AnnualApportionedEmissionsService.getEmissionsStateAggregation() and gets all emissions data', async () => {
      const byStateList = genAnnualApportionedEmissionsStateDto();
      const mockedValues = {
        items: byStateList
      }
      const paramsDto = new PaginatedAnnualApportionedEmissionsParamsDTO();
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
    it('calls AnnualApportionedEmissionsService.getEmissionsNationalAggregation() and gets all emissions data', async () => {
      const nationlityList = genAnnualApportionedEmissionsNationalDto();
      const mockedValues ={
        items: nationlityList
      }
      const paramsDto = new PaginatedAnnualApportionedEmissionsParamsDTO();
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
