import { Test } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AnnualUnitDataView } from '../../entities/vw-annual-unit-data.entity';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';
import { AnnualApportionedEmissionsController } from './annual-apportioned-emissions.controller';
import { PaginatedAnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';
import {
  genAnnualApportionedEmissionsNationalDto,
  genAnnualUnitData,
  genAnnualApportionedEmissionsFacilityDto,
  genAnnualApportionedEmissionsStateDto,
} from '../../../test/object-generators/apportioned-emissions';

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
      providers: [AnnualApportionedEmissionsService, AnnualUnitDataRepository],
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
      const mockedValues = genAnnualUnitData<AnnualUnitDataView>();
      const paramsDto = new PaginatedAnnualApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'getEmissions').mockResolvedValue(mockedValues);
      expect(await controller.getEmissions(req, paramsDto)).toBe(mockedValues);
    });
  });

  describe('* getEmissionsFacilityAggregation', () => {
    it('calls AnnualApportionedEmissionsService.getEmissionsFacilityAggregation() and gets all emissions data', async () => {
      const mockedValues = genAnnualApportionedEmissionsFacilityDto();
      const paramsDto = new PaginatedAnnualApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissionsFacilityAggregation')
        .mockResolvedValue(mockedValues);
      const results = await controller.getEmissionsFacilityAggregation(
        req,
        paramsDto,
      );
      expect(results).toBe(mockedValues);
    });
  });

  describe('* getEmissionsStateAggregation', () => {
    it('calls AnnualApportionedEmissionsService.getEmissionsStateAggregation() and gets all emissions data', async () => {
      const mockedValues = genAnnualApportionedEmissionsStateDto();
      const paramsDto = new PaginatedAnnualApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissionsStateAggregation')
        .mockResolvedValue(mockedValues);
      const results = await controller.getEmissionsStateAggregation(
        req,
        paramsDto,
      );
      expect(results).toBe(mockedValues);
    });
  });

  describe('* getEmissionsNationalAggregation', () => {
    it('calls AnnualApportionedEmissionsService.getEmissionsNationalAggregation() and gets all emissions data', async () => {
      const mockedValues = genAnnualApportionedEmissionsNationalDto();
      const paramsDto = new PaginatedAnnualApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissionsNationalAggregation')
        .mockResolvedValue(mockedValues);
      const results = await controller.getEmissionsNationalAggregation(
        req,
        paramsDto,
      );
      expect(results).toBe(mockedValues);
    });
  });
});
