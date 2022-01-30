import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { QuarterlyApportionedEmissionsService } from './quarterly-apportioned-emissions.service';
import { QuarterlyApportionedEmissionsMap } from '../../maps/quarterly-apportioned-emissions.map';
import { QuarterlyApportionedEmissionsDTO } from '../../dto/quarterly-apportioned-emissions.dto';
import {
  QuarterlyApportionedEmissionsParamsDTO,
  PaginatedQuarterlyApportionedEmissionsParamsDTO,
} from '../../dto/quarterly-apportioned-emissions.params.dto';

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

describe('-- Quarterly Apportioned Emissions Service --', () => {
  let service: QuarterlyApportionedEmissionsService;
  let repository: any;
  let map: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        QuarterlyApportionedEmissionsService,
        {
          provide: QuarterUnitDataRepository,
          useFactory: mockRepository,
        },
        {
          provide: QuarterlyApportionedEmissionsMap,
          useFactory: mockMap
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();    
    service = module.get(QuarterlyApportionedEmissionsService);
    repository = module.get(QuarterUnitDataRepository);
    map = module.get(QuarterlyApportionedEmissionsMap);
  });

  describe('getEmissions', () => {
    it('calls QuarterUnitDataRepository.getEmissions() and gets all emissions from the repository', async () => {
      repository.getEmissions.mockResolvedValue(
        'list of emissions',
      );
      const dto = new QuarterlyApportionedEmissionsDTO();
      map.many.mockReturnValue(dto);

      let filters = new PaginatedQuarterlyApportionedEmissionsParamsDTO();

      let result = await service.getEmissions(req, filters);

      expect(map.many).toHaveBeenCalled();
      expect(result).toEqual(dto);
    });
  });
});
