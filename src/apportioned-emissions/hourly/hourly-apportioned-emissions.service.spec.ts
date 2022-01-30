import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { HourlyApportionedEmissionsMap } from '../../maps/hourly-apportioned-emissions.map';
import { HourlyApportionedEmissionsDTO } from '../../dto/hourly-apportioned-emissions.dto';
import { 
  HourlyApportionedEmissionsParamsDTO,
  PaginatedHourlyApportionedEmissionsParamsDTO,
} from '../../dto/hourly-apportioned-emissions.params.dto';

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

describe('-- Hourly Apportioned Emissions Service --', () => {
  let service: HourlyApportionedEmissionsService;
  let repository: any;
  let map: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        HourlyApportionedEmissionsService,
        {
          provide: HourUnitDataRepository,
          useFactory: mockRepository,
        },
        {
          provide: HourlyApportionedEmissionsMap,
          useFactory: mockMap
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();    
    service = module.get(HourlyApportionedEmissionsService);
    repository = module.get(HourUnitDataRepository);
    map = module.get(HourlyApportionedEmissionsMap);
  });

  describe('getEmissions', () => {
    it('calls HourUnitDataRepository.getEmissions() and gets all emissions from the repository', async () => {
      repository.getEmissions.mockResolvedValue(
        'list of emissions',
      );
      const dto = new HourlyApportionedEmissionsDTO();
      map.many.mockReturnValue(dto);

      let filters = new PaginatedHourlyApportionedEmissionsParamsDTO();

      let result = await service.getEmissions(req, filters);

      expect(map.many).toHaveBeenCalled();
      expect(result).toEqual(dto);
    });
  });
});
