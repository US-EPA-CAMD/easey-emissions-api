import { Test } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MatsApportionedEmissionsService } from './mats-apportioned-emissions.service';
import { HourUnitMatsDataRepository } from './hourly/hour-unit-mats-data.repository';
import { MatsApportionedEmissionsController } from './mats-apportioned-emissions.controller';
import { HourlyMatsApportionedEmissionsService } from './hourly/hourly-mats-apportioned-emissions.service';
import { ApplicableApportionedEmissionsAttributesParamsDTO } from '../../dto/applicable-apportioned-emissions-attributes.params.dto';
import { UnitFactRepository } from '../unit-fact.repository';
import { genApplicableApportionedEmissionsAttributesDto } from '../../../test/object-generators/apportioned-emissions';

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
        UnitFactRepository,
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
    it('calls MatsApportionedEmissionsService.getApplicableApportionedEmissionsAttributes() and gets all emissions data', async () => {
      const expectedResult = genApplicableApportionedEmissionsAttributesDto();
      const paramsDto = new ApplicableApportionedEmissionsAttributesParamsDTO();
      jest
        .spyOn(service, 'getApplicableApportionedEmissionsAttributes')
        .mockResolvedValue(expectedResult);
      expect(await controller.getApplicableEmissions(paramsDto)).toBe(
        expectedResult,
      );
    });
  });
});
