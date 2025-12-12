import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource, EntityManager } from 'typeorm';

import { genHourUnitMatsDataView } from '../../../../test/object-generators/apportioned-emissions';
import { PaginatedHourlyMatsApportionedEmissionsParamsDTO } from '../../../dto/hourly-mats-apporitioned-emissions.params.dto';
import { HourUnitMatsDataView } from '../../../entities/vw-hour-unit-mats-data.entity';
import { HourUnitMatsDataRepository } from './hour-unit-mats-data.repository';
import { HourlyMatsApportionedEmissionsController } from './hourly-mats-apportioned-emissions.controller';
import { HourlyMatsApportionedEmissionsService } from './hourly-mats-apportioned-emissions.service';

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
        EntityManager,
        HourlyMatsApportionedEmissionsService,
        HourUnitMatsDataRepository,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              isReleased: false,
            }),
          },
        }
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
    it('calls HourlyMatsApportionedEmissionsService.getEmissions() and gets all emissions data', async () => {
      const hourlyList = genHourUnitMatsDataView<HourUnitMatsDataView>();
      const expectedResult = {
        items: hourlyList
      }
      const paramsDto = new PaginatedHourlyMatsApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'getEmissions').mockResolvedValue(hourlyList);
      expect(await controller.getEmissions(req, paramsDto)).toEqual(
        expectedResult,
      );
    });
  });
});
