import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitAttributesMap } from '../../maps/unit-atributes.map';
import { ApportionedEmissionsMap } from '../../maps/apportioned-emissions.map';
import { DailyApportionedEmissionsMap } from '../../maps/daily-apportioned-emissions.map';
import { UnitFacilityIdentificationMap } from '../../maps/unit-facility-identification.map';

import { DailyApportionedEmissionsDTO } from '../../dto/daily-apportioned-emissions.dto';
import {
  DailyApportionedEmissionsParamsDTO,
  PaginatedDailyApportionedEmissionsParamsDTO,
} from '../../dto/daily-apportioned-emissions.params.dto';

import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';
import { DailyApportionedEmissionsController } from './daily-apportioned-emissions.controller';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Daily Apportioned Emissions Controller --', () => {
  let controller: DailyApportionedEmissionsController;
  let service: DailyApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [DailyApportionedEmissionsController],
      providers: [
        UnitAttributesMap,
        DayUnitDataRepository,        
        ApportionedEmissionsMap,
        UnitFacilityIdentificationMap,
        DailyApportionedEmissionsMap,
        DailyApportionedEmissionsService
      ],
    }).compile();

    controller = module.get(DailyApportionedEmissionsController);
    service = module.get(DailyApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getEmissions', () => {
    it('should return test 1', async () => {
      const expectedResult: DailyApportionedEmissionsDTO[] = [];
      const paramsDto = new PaginatedDailyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissions')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.getEmissions(req, paramsDto),
      ).toBe(expectedResult);
    });
  });
});
