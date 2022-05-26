import { Test } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { HourUnitDataView } from '../../entities/vw-hour-unit-data.entity';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { HourlyApportionedEmissionsController } from './hourly-apportioned-emissions.controller';
import { PaginatedHourlyApportionedEmissionsParamsDTO } from '../../dto/hourly-apportioned-emissions.params.dto';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Hourly Apportioned Emissions Controller --', () => {
  let controller: HourlyApportionedEmissionsController;
  let service: HourlyApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [HourlyApportionedEmissionsController],
      providers: [HourlyApportionedEmissionsService, HourUnitDataRepository],
    }).compile();

    controller = module.get(HourlyApportionedEmissionsController);
    service = module.get(HourlyApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getEmissions', () => {
    it('should return test 1', async () => {
      const expectedResult: HourUnitDataView[] = [];
      const paramsDto = new PaginatedHourlyApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'getEmissions').mockResolvedValue(expectedResult);
      expect(await controller.getEmissions(req, paramsDto)).toBe(
        expectedResult,
      );
    });
  });
});
