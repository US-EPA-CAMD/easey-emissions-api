import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { HourlyMatsApportionedEmissionsController } from './hourly-mats-apportioned-emissions.controller';
import { HourlyMatsApportionedEmissionsService } from './hourly-mats-apportioned-emissions.service';
import { HourUnitMatsDataRepository } from './hour-unit-mats-data.repository';
import { HourUnitMatsDataView } from '../../../entities/vw-hour-unit-mats-data.entity';
import { PaginatedHourlyMatsApportionedEmissionsParamsDTO } from '../../../dto/hourly-mats-apporitioned-emissions.params.dto';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Hourly MATS Apportioned Emissions Controller --', () => {
  let controller: HourlyMatsApportionedEmissionsController;
  let service: HourlyMatsApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [HourlyMatsApportionedEmissionsController],
      providers: [
        HourlyMatsApportionedEmissionsService,
        HourUnitMatsDataRepository,
      ],
    }).compile();

    controller = module.get(HourlyMatsApportionedEmissionsController);
    service = module.get(HourlyMatsApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getEmissions', () => {
    it('should return test 1', async () => {
      const expectedResult: HourUnitMatsDataView[] = [];
      const paramsDto = new PaginatedHourlyMatsApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'getEmissions').mockResolvedValue(expectedResult);
      expect(await controller.getEmissions(req, paramsDto)).toBe(
        expectedResult,
      );
    });
  });
});
