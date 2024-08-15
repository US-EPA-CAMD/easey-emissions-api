import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

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
    it('should return test 1', async () => {
      const expectedResult: AnnualUnitDataView[] = [];
      const paramsDto = new PaginatedAnnualApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'getEmissions').mockResolvedValue(expectedResult);
      expect(await controller.getEmissions(req, paramsDto)).toBe(
        expectedResult,
      );
    });
  });

  describe('* getEmissionsFacilityAggregation', () => {
    it('should return test 1', async () => {
      const expectedResult: AnnualUnitDataView[] = [];
      const paramsDto = new PaginatedAnnualApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissionsFacilityAggregation')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.getEmissionsFacilityAggregation(req, paramsDto),
      ).toBe(expectedResult);
    });
  });

  describe('* getEmissionsStateAggregation', () => {
    it('should return test 1', async () => {
      const expectedResult: AnnualUnitDataView[] = [];
      const paramsDto = new PaginatedAnnualApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissionsStateAggregation')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.getEmissionsStateAggregation(req, paramsDto),
      ).toBe(expectedResult);
    });
  });

  describe('* getEmissionsNationalAggregation', () => {
    it('should return test 1', async () => {
      const expectedResult: AnnualUnitDataView[] = [];
      const paramsDto = new PaginatedAnnualApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissionsNationalAggregation')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.getEmissionsNationalAggregation(req, paramsDto),
      ).toBe(expectedResult);
    });
  });
});
