import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { ReviewSubmitService } from './ReviewSubmit.service';
import { EmissionsReviewSubmitRepository } from './ReviewSubmit.repository';
import { EmissionsReviewSubmitMap } from '../maps/emissions-review-submit.map';
import { EmissionsReviewSubmitDTO } from '../dto/emissions-review-submit.dto';
import { EmissionsReviewSubmitGlobalRepository } from './ReviewSubmitGlobal.repository';

const mockRepo = () => ({
  find: jest.fn().mockImplementation(args => {

    const hasMonPlanId = !!args.where.monPlanId;
    const hasPeriodAbbreviation = args.where.hasOwnProperty('periodAbbreviation');

    if (hasMonPlanId) {
      if (hasPeriodAbbreviation) {
        return Promise.resolve([new EmissionsReviewSubmitDTO()]); // monPlanId with quarters -> 1 DTO
      } else {
        return Promise.resolve([]); // monPlanId without quarters -> 0 DTOs
      }
    } else {
      if (hasPeriodAbbreviation) {
        return Promise.resolve([new EmissionsReviewSubmitDTO(), new EmissionsReviewSubmitDTO()]); // orisCode with quarters -> 2 DTOs
      } else {
        return Promise.resolve([new EmissionsReviewSubmitDTO()]); // orisCode without quarters -> 1 DTO
      }
    }
  }),
});

const mockMap = () => ({
  many: jest.fn().mockImplementation(args => {
    return args;
  }),
});

describe('ReviewSubmitService', () => {
  let service: ReviewSubmitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ReviewSubmitService,
        ConfigService,
        { provide: EmissionsReviewSubmitMap, useFactory: mockMap },
        {
          provide: EmissionsReviewSubmitRepository,
          useFactory: mockRepo,
        },
        {
          provide: EmissionsReviewSubmitGlobalRepository,
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
      const result = await service.getEmissionsRecords([3], [], ['2022 Q2']);
      expect(result.length).toBe(2);
    });

    it('should call the service function given list of monPlanIds', async () => {
      const result = await service.getEmissionsRecords(
        [],
        ['MOCK'],
        ['2022 Q2'],
      );
      expect(result.length).toBe(1);
    });

    it('should handle orisCodes path correctly when quarters is null (no periodAbbreviation)', async () => {
      const result = await service.getEmissionsRecords(
        [3], 
        [],  
        null,
      );
      expect(result.length).toBe(1);
    });

    it('should handle monPlanIds path correctly when quarters is an array with an empty string (no periodAbbreviation)', async () => {
      const result = await service.getEmissionsRecords(
        [],      
        ['MOCK'],
        [""],    
      );
      expect(result.length).toBe(0);
    });
    
    it('should handle orisCodes path correctly when quarters is an empty array (no periodAbbreviation)', async () => {
      const result = await service.getEmissionsRecords(
        [3],
        [], 
        [], 
      );
      expect(result.length).toBe(1);
    });
  });
});
