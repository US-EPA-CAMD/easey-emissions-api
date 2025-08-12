import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { ReviewSubmitService } from './ReviewSubmit.service';
import { EmissionsReviewSubmitAllRepository } from './emissions-review-submit-all.repository';
import { EmissionsReviewSubmitMap } from '../maps/emissions-review-submit.map';
import { EmissionsReviewSubmitDTO } from '../dto/emissions-review-submit.dto';
import { EmissionsReviewSubmitAllGlobalRepository } from './emissions-review-submit-all-global.repository';
import { EmissionsReviewSubmitEarliestRepository } from './emissions-review-submit-earliest.repository';
import { EntityManager } from 'typeorm';

const mockRepo = () => ({
  find: jest.fn().mockImplementation(args => {

    const hasMonPlanId = !!args.where.monPlanId;
    const hasPeriodAbbreviation = args.where.hasOwnProperty('periodAbbreviation');

    if (hasMonPlanId) {
      if (hasPeriodAbbreviation) {
        return Promise.resolve([]);
      } else {
        return Promise.resolve([new EmissionsReviewSubmitDTO()]);
      }
    } else if (hasPeriodAbbreviation) {
      return Promise.resolve([new EmissionsReviewSubmitDTO(), new EmissionsReviewSubmitDTO()]);
    }
    return Promise.resolve([new EmissionsReviewSubmitDTO(), new EmissionsReviewSubmitDTO(), new EmissionsReviewSubmitDTO()]);
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
          useValue: {
            query: manager,
          },
        },
        ReviewSubmitService,
        ConfigService,
        { provide: EmissionsReviewSubmitMap, useFactory: mockMap },
        {
          provide: EmissionsReviewSubmitAllRepository,
          useFactory: mockRepo,
        },
        {
          provide: EmissionsReviewSubmitAllGlobalRepository,
          useFactory: mockRepo,
        },
        {
          provide: EmissionsReviewSubmitEarliestRepository,
          useFactory: mockRepo,
        },
        EmissionsReviewSubmitMap,
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
