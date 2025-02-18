import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import {
  genAnnualApportionedEmissionsFacilityDto,
  genAnnualApportionedEmissionsNationalDto,
  genAnnualApportionedEmissionsStateDto,
  genAnnualUnitData,
} from '../../../test/object-generators/apportioned-emissions';
import { PaginatedOzoneApportionedEmissionsParamsDTO } from '../../dto/ozone-apportioned-emissions.params.dto';
import { OzoneUnitDataView } from '../../entities/vw-ozone-unit-data.entity';
import { OzoneApportionedEmissionsController } from './ozone-apportioned-emissions.controller';
import { OzoneApportionedEmissionsService } from './ozone-apportioned-emissions.service';
import { OzoneUnitDataRepository } from './ozone-unit-data.repository';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Ozone Apportioned Emissions Controller --', () => {
  let controller: OzoneApportionedEmissionsController;
  let service: OzoneApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [OzoneApportionedEmissionsController],
      providers: [
        EntityManager,
        OzoneApportionedEmissionsService,
        OzoneUnitDataRepository,
      ],
    }).compile();

    controller = module.get(OzoneApportionedEmissionsController);
    service = module.get(OzoneApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getEmissions', () => {
    it('calls OzoneApportionedEmissionsService.getEmissions() and returns all emissions data', async () => {
      const ozoneList = genAnnualUnitData<OzoneUnitDataView>();
      const expectedResult = {
        items: ozoneList
      }
      const paramsDto = new PaginatedOzoneApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'getEmissions').mockResolvedValue(ozoneList);
      expect(await controller.getEmissions(req, paramsDto)).toEqual(
        expectedResult,
      );
    });
  });

  describe('* getEmissionsFacilityAggregation', () => {
    it('calls OzoneApportionedEmissionsService.getEmissionsFacilityAggregation() and gets all emissions data', async () => {
      const byFacilityList = genAnnualApportionedEmissionsFacilityDto();
      const paramsDto = new PaginatedOzoneApportionedEmissionsParamsDTO();
      const expectedResult = {
        items: byFacilityList
      }
      jest
        .spyOn(service, 'getEmissionsFacilityAggregation')
        .mockResolvedValue(byFacilityList);
      expect(
        await controller.getEmissionsFacilityAggregation(req, paramsDto),
      ).toEqual(expectedResult);
    });
  });

  describe('* getEmissionsStateAggregation', () => {
    it('calls OzoneApportionedEmissionsService.getEmissionsStateAggregation() and gets all emissions data', async () => {
      const byStateList = genAnnualApportionedEmissionsStateDto();
      const paramsDto = new PaginatedOzoneApportionedEmissionsParamsDTO();
      const expectedResult = {
        items: byStateList
      }
      jest
        .spyOn(service, 'getEmissionsStateAggregation')
        .mockResolvedValue(byStateList);
      expect(
        await controller.getEmissionsStateAggregation(req, paramsDto),
      ).toEqual(expectedResult);
    });
  });

  describe('* getEmissionsNationalAggregation', () => {
    it('calls OzoneApportionedEmissionsService.getEmissionsNationalAggregation() and gets all emissions data', async () => {
      const nationlityList = genAnnualApportionedEmissionsNationalDto();
      const paramsDto = new PaginatedOzoneApportionedEmissionsParamsDTO();
      const expectedResult = {
        items: nationlityList
      }
      jest
        .spyOn(service, 'getEmissionsNationalAggregation')
        .mockResolvedValue(nationlityList);
      expect(
        await controller.getEmissionsNationalAggregation(req, paramsDto),
      ).toEqual(expectedResult);
    });
  });
});
