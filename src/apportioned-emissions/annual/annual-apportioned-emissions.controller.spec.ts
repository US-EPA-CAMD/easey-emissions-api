import { ReadStream } from 'fs';
import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitAttributesMap } from '../../maps/unit-atributes.map';
import { ApportionedEmissionsMap } from '../../maps/apportioned-emissions.map';
import { AnnualApportionedEmissionsMap } from '../../maps/annual-apportioned-emissions.map';
import { UnitFacilityIdentificationMap } from '../../maps/unit-facility-identification.map';

import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';
import { AnnualApportionedEmissionsController } from './annual-apportioned-emissions.controller';

import { AnnualApportionedEmissionsDTO } from '../../dto/annual-apportioned-emissions.dto';
import { 
  AnnualApportionedEmissionsParamsDTO,
  PaginatedAnnualApportionedEmissionsParamsDTO,
} from '../../dto/annual-apportioned-emissions.params.dto';

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
        UnitAttributesMap,
        ApportionedEmissionsMap,
        UnitFacilityIdentificationMap,
        AnnualApportionedEmissionsMap,
        AnnualApportionedEmissionsService,        
        AnnualUnitDataRepository,
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
      const expectedResult: AnnualApportionedEmissionsDTO[] = [];
      const paramsDto = new PaginatedAnnualApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissions')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.getEmissions(req, paramsDto),
      ).toBe(expectedResult);
    });
  });

  // describe('* streamEmissions', () => {
  //   it('should return test 1', async () => {
  //     const expectedResult = new StreamableFile(new ReadStream());
  //     const paramsDto = new AnnualApportionedEmissionsParamsDTO();
  //     jest
  //       .spyOn(service, 'streamEmissions')
  //       .mockResolvedValue(expectedResult);
  //     expect(
  //       await controller.streamEmissions(req, paramsDto),
  //     ).toBe(expectedResult);
  //   });
  // });
});
