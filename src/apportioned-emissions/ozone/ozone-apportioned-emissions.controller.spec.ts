import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitFactMap } from '../../maps/unit-atributes.map';
import { ApportionedEmissionsMap } from '../../maps/apportioned-emissions.map';
import { OzoneApportionedEmissionsMap } from '../../maps/ozone-apportioned-emissions.map';
import { AnnualApportionedEmissionsMap } from '../../maps/annual-apportioned-emissions.map';

import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
import { OzoneApportionedEmissionsService } from './ozone-apportioned-emissions.service';
import { OzoneApportionedEmissionsController } from './ozone-apportioned-emissions.controller';

import { OzoneApportionedEmissionsDTO } from '../../dto/ozone-apportioned-emissions.dto';
import { 
  OzoneApportionedEmissionsParamsDTO,
  PaginatedOzoneApportionedEmissionsParamsDTO,
} from '../../dto/ozone-apportioned-emissions.params.dto';

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
        UnitFactMap,
        ApportionedEmissionsMap,
        AnnualApportionedEmissionsMap,        
        OzoneApportionedEmissionsMap,
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
    it('should return test 1', async () => {
      const expectedResult: OzoneApportionedEmissionsDTO[] = [];
      const paramsDto = new PaginatedOzoneApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissions')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.getEmissions(req, paramsDto),
      ).toBe(expectedResult);
    });
  });
});
