import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitFactMap } from '../../maps/unit-atributes.map';
import { ApportionedEmissionsMap } from '../../maps/apportioned-emissions.map';
import { QuarterlyApportionedEmissionsMap } from '../../maps/quarterly-apportioned-emissions.map';

import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { QuarterlyApportionedEmissionsService } from './quarterly-apportioned-emissions.service';
import { QuarterlyApportionedEmissionsController } from './quarterly-apportioned-emissions.controller';

import { QuarterlyApportionedEmissionsDTO } from '../../dto/quarterly-apportioned-emissions.dto';
import {
  QuarterlyApportionedEmissionsParamsDTO,
  PaginatedQuarterlyApportionedEmissionsParamsDTO,
} from '../../dto/quarterly-apportioned-emissions.params.dto';

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
        UnitFactMap,
        ApportionedEmissionsMap,
        QuarterlyApportionedEmissionsMap,
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
      const expectedResult: QuarterlyApportionedEmissionsDTO[] = [];
      const paramsDto = new PaginatedQuarterlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissions')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.getEmissions(req, paramsDto),
      ).toBe(expectedResult);
    });
  });
});
