import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { DayUnitDataView } from '../../entities/vw-day-unit-data.entity';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';

import { 
  DailyApportionedEmissionsParamsDTO,
  PaginatedDailyApportionedEmissionsParamsDTO,
} from '../../dto/daily-apportioned-emissions.params.dto';

const mockRepository = () => ({
  getEmissions: jest.fn(),
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
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();    
    service = module.get(DailyApportionedEmissionsService);
    repository = module.get(DayUnitDataRepository);
  });

  describe('getEmissions', () => {
    it('calls DayUnitDataRepository.getEmissions() and gets all emissions from the repository', async () => {
      const expected = DayUnitDataView[0];
      repository.getEmissions.mockResolvedValue(expected);
      let filters = new PaginatedDailyApportionedEmissionsParamsDTO();
      let result = await service.getEmissions(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('streamEmissions', () => {
    it('calls DailyUnitDataRepository.streamEmissions() and streams all emissions from the repository', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      repository.streamEmissions.mockResolvedValue(expectedResult);
      let filters = new DailyApportionedEmissionsParamsDTO();
      let result = await service.streamEmissions(req, filters);
      expect(result).toEqual(expectedResult);
    });
  });
});