import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { PaginatedQuarterlyApportionedEmissionsParamsDTO } from '../../dto/quarterly-apportioned-emissions.params.dto';
import { QuarterUnitDataView } from '../../entities/vw-quarter-unit-data.entity';
import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { QuarterlyApportionedEmissionsController } from './quarterly-apportioned-emissions.controller';
import { QuarterlyApportionedEmissionsService } from './quarterly-apportioned-emissions.service';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Quarterly Apportioned Emissions Controller --', () => {
  let controller: QuarterlyApportionedEmissionsController;
  let service: QuarterlyApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [QuarterlyApportionedEmissionsController],
      providers: [
        EntityManager,
        QuarterlyApportionedEmissionsService,
        QuarterUnitDataRepository,
      ],
    }).compile();

    controller = module.get(QuarterlyApportionedEmissionsController);
    service = module.get(QuarterlyApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getEmissions', () => {
    it('should return test 1', async () => {
      const expectedResult: QuarterUnitDataView[] = [];
      const paramsDto = new PaginatedQuarterlyApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'getEmissions').mockResolvedValue(expectedResult);
      expect(await controller.getEmissions(req, paramsDto)).toBe(
        expectedResult,
      );
    });
  });

  describe('* getEmissionsFacilityAggregation', () => {
    it('should return test 1', async () => {
      const expectedResult: QuarterUnitDataView[] = [];
      const paramsDto = new PaginatedQuarterlyApportionedEmissionsParamsDTO();
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
      const expectedResult: QuarterUnitDataView[] = [];
      const paramsDto = new PaginatedQuarterlyApportionedEmissionsParamsDTO();
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
      const expectedResult: QuarterUnitDataView[] = [];
      const paramsDto = new PaginatedQuarterlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissionsNationalAggregation')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.getEmissionsNationalAggregation(req, paramsDto),
      ).toBe(expectedResult);
    });
  });
});
