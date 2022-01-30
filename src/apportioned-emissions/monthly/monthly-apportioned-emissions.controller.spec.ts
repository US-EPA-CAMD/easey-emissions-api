import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitFactMap } from '../../maps/unit-atributes.map';
import { ApportionedEmissionsMap } from '../../maps/apportioned-emissions.map';
import { MonthlyApportionedEmissionsMap } from '../../maps/monthly-apportioned-emissions.map';

import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';
import { MonthlyApportionedEmissionsController } from './monthly-apportioned-emissions.controller';

import { MonthlyApportionedEmissionsDTO } from '../../dto/monthly-apportioned-emissions.dto';
import { 
  MonthlyApportionedEmissionsParamsDTO,
  PaginatedMonthlyApportionedEmissionsParamsDTO,
} from '../../dto/monthly-apportioned-emissions.params.dto';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Monthly Apportioned Emissions Controller --', () => {
  let controller: MonthlyApportionedEmissionsController;
  let service: MonthlyApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [MonthlyApportionedEmissionsController],
      providers: [
        UnitFactMap,
        ApportionedEmissionsMap,
        MonthlyApportionedEmissionsMap,
        MonthlyApportionedEmissionsService,        
        MonthUnitDataRepository,
      ],
    }).compile();

    controller = module.get(MonthlyApportionedEmissionsController);
    service = module.get(MonthlyApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getEmissions', () => {
    it('should return test 1', async () => {
      const expectedResult: MonthlyApportionedEmissionsDTO[] = [];
      const paramsDto = new PaginatedMonthlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'getEmissions')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.getEmissions(req, paramsDto),
      ).toBe(expectedResult);
    });
  });
});
