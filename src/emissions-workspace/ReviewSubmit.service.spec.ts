import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { ReviewSubmitService } from './ReviewSubmit.service';
import { EmissionsReviewMap } from '../maps/emissions-review.map';
import { EmissionsReviewDTO } from '../dto/emissions-review.dto';
import { EntityManager } from 'typeorm';

const mockManager = () => ({
  find: (_entity, args) => new Promise((resolve) => {
    console.log(args);
    const hasMonPlanId = !!args.where.monPlanId;
    const hasPeriodAbbreviation = args.where.hasOwnProperty('periodAbbreviation');

    if (hasMonPlanId) {
      if (hasPeriodAbbreviation) {
        return resolve([]);
      } else {
        return resolve([new EmissionsReviewDTO()]);
      }
    } else if (hasPeriodAbbreviation) {
      return resolve([new EmissionsReviewDTO(), new EmissionsReviewDTO()]);
    }
    return resolve([new EmissionsReviewDTO(), new EmissionsReviewDTO(), new EmissionsReviewDTO()]);
  }),
});

const mockMap = () => ({
  many: jest.fn().mockImplementation(args => {
    return args;
  }),
});

describe('ReviewSubmitService', () => {
  let manager: jest.Mock;
  let service: ReviewSubmitService;

  manager = jest.fn().mockResolvedValue([{}]);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        {
          provide: EntityManager,
          useFactory: mockManager,
        },
        ReviewSubmitService,
        ConfigService,
        { provide: EmissionsReviewMap, useFactory: mockMap },
        EmissionsReviewMap,
      ],
    }).compile();

    service = module.get<ReviewSubmitService>(ReviewSubmitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEmissionsRecords', () => {
    it('should call the service function given list of orisCodes', async () => {
      const result = await service.getEmissionsRecords({
        orisCodes: [3],
        monPlanIds: [],
        quarters: []
      });
      expect(result.length).toBe(3);
    });

    it('should call the service function given list of monPlanIds, no quarters', async () => {
      const result = await service.getEmissionsRecords({
        orisCodes: [3],
        monPlanIds: ['MOCK'],
        quarters: [],
      });
      expect(result.length).toBe(1);
    });

    it('should call the service function given list of quarters, no monPlanIds', async () => {
      const result = await service.getEmissionsRecords({
        orisCodes: [3], 
        monPlanIds: [],  
        quarters: ["Q3"],
      });
      expect(result.length).toBe(2);
    });

    it('sshould call the service function given list of quarters and monPlanIds', async () => {
      const result = await service.getEmissionsRecords({
        orisCodes: [3],
        monPlanIds: ['MOCK'],
        quarters: ["Q3"],    
      });
      expect(result.length).toBe(0);
    });
  });
});
