import { Test } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MatsApportionedEmissionsService } from './mats-apportioned-emissions.service';
import { ApplicableMatsApportionedEmissionsAttributesParamsDTO } from '../../dto/applicable-mats-apportioned-emissions-attributes-params.dto';
import { ApplicableMatsApportionedEmissionsAttributesDTO } from '../../dto/applicable-mats-apportioned-emissions-attributes.dto';
import { HourUnitMatsDataRepository } from './hourly/hour-unit-mats-data.repository';
import { MatsApportionedEmissionsController } from './mats-apportioned-emissions.controller';
import { HourlyMatsApportionedEmissionsService } from './hourly/hourly-mats-apportioned-emissions.service';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- MATS Apportioned Emissions Controller --', () => {
  let controller: MatsApportionedEmissionsController;
  let service: MatsApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [MatsApportionedEmissionsController],
      providers: [
        MatsApportionedEmissionsService,
        HourlyMatsApportionedEmissionsService,
        HourUnitMatsDataRepository,
      ],
    }).compile();

    controller = module.get(MatsApportionedEmissionsController);
    service = module.get(MatsApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getApplicableEmissions', () => {
    it('should return test 1', async () => {
      const expectedResult: ApplicableMatsApportionedEmissionsAttributesDTO[] = [];
      const paramsDto = new ApplicableMatsApportionedEmissionsAttributesParamsDTO();
      jest
        .spyOn(service, 'getApplicableEmissions')
        .mockResolvedValue(expectedResult);
      expect(await controller.getApplicableEmissions(paramsDto)).toBe(
        expectedResult,
      );
    });
  });
});