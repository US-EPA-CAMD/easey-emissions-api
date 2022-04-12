import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonthUnitDataView } from '../../entities/vw-month-unit-data.entity';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';
import { MonthlyApportionedEmissionsController } from './monthly-apportioned-emissions.controller';

import {
  MonthlyApportionedEmissionsParamsDTO,
  PaginatedMonthlyApportionedEmissionsParamsDTO,
} from '../../dto/monthly-apportioned-emissions.params.dto';
import { StreamModule } from '@us-epa-camd/easey-common/stream';

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
      imports: [LoggerModule, StreamModule],
      controllers: [MonthlyApportionedEmissionsController],
      providers: [MonthlyApportionedEmissionsService, MonthUnitDataRepository],
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
      const expectedResult: MonthUnitDataView[] = [];
      const paramsDto = new PaginatedMonthlyApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'getEmissions').mockResolvedValue(expectedResult);
      expect(await controller.getEmissions(req, paramsDto)).toBe(
        expectedResult,
      );
    });
  });

  describe('* streamEmissions', () => {
    it('should return test 1', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new MonthlyApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'streamEmissions').mockResolvedValue(expectedResult);
      expect(await controller.streamEmissions(req, paramsDto)).toBe(
        expectedResult,
      );
    });
  });
});
