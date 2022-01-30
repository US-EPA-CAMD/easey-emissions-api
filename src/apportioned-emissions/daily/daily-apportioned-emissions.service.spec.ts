import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';
import { DailyApportionedEmissionsMap } from '../../maps/daily-apportioned-emissions.map';
import { DailyApportionedEmissionsDTO } from '../../dto/daily-apportioned-emissions.dto';
import { 
  DailyApportionedEmissionsParamsDTO,
  PaginatedDailyApportionedEmissionsParamsDTO,
} from '../../dto/daily-apportioned-emissions.params.dto';

const mockRepository = () => ({
  getEmissions: jest.fn(),
});

const mockMap = () => ({
  many: jest.fn(),
});

const mockRequest = () => {
  return {
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Daily Apportioned Emissions Service --', () => {
  let service: DailyApportionedEmissionsService;
  let repository: any;
  let map: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        DailyApportionedEmissionsService,
        {
          provide: DayUnitDataRepository,
          useFactory: mockRepository,
        },
        {
          provide: DailyApportionedEmissionsMap,
          useFactory: mockMap
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();    
    service = module.get(DailyApportionedEmissionsService);
    repository = module.get(DayUnitDataRepository);
    map = module.get(DailyApportionedEmissionsMap);
  });

  describe('getEmissions', () => {
    it('calls DayUnitDataRepository.getEmissions() and gets all emissions from the repository', async () => {
      repository.getEmissions.mockResolvedValue(
        'list of emissions',
      );
      const dto = new DailyApportionedEmissionsDTO();
      map.many.mockReturnValue(dto);

      let filters = new PaginatedDailyApportionedEmissionsParamsDTO();

      let result = await service.getEmissions(req, filters);

      expect(map.many).toHaveBeenCalled();
      expect(result).toEqual(dto);
    });
  });
});
