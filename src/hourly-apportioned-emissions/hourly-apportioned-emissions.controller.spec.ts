import { Test } from '@nestjs/testing';

import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { HourlyApportionedEmissionsController } from './hourly-apportioned-emissions.controller';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Hourly Apportioned Emissions Controller --', () => {
  let hourlyApportionedEmissionsController: HourlyApportionedEmissionsController;
  let hourlyApportionedEmissionsService: HourlyApportionedEmissionsService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [HourlyApportionedEmissionsController],
      providers: [
        HourlyApportionedEmissionsMap,
        HourlyApportionedEmissionsService,
        HourUnitDataRepository,
      ],
    }).compile();

    hourlyApportionedEmissionsController = module.get(
      HourlyApportionedEmissionsController,
    );
    hourlyApportionedEmissionsService = module.get(
      HourlyApportionedEmissionsService,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getHourlyEmissions', () => {
    const req: any = mockRequest('');
    req.res.setHeader.mockReturnValue();

    it('should return test 1', async () => {
      const expectedResult: HourlyApportionedEmissionsDTO[] = [];
      const paramsDto = new HourlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(hourlyApportionedEmissionsService, 'getHourlyEmissions')
        .mockResolvedValue(expectedResult);
      expect(
        await hourlyApportionedEmissionsController.getHourlyEmissions(
          paramsDto,
          req,
        ),
      ).toBe(expectedResult);
    });
  });
});
