import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { ReviewSubmitService } from './ReviewSubmit.service';
import { EmissionsReviewSubmitRepository } from './ReviewSubmit.repository';
import { EmissionsReviewSubmitMap } from '../maps/emissions-review-submit.map';
import { EmissionsReviewSubmitDTO } from '../dto/emissions-review-submit.dto';

const mockRepo = () => ({
  find: jest.fn().mockImplementation(args => {
    if (args.where['monPlanIdentifier']) {
      return [new EmissionsReviewSubmitDTO()];
    } else {
      return [new EmissionsReviewSubmitDTO(), new EmissionsReviewSubmitDTO()];
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
      const result = await service.getEmissionsRecords([3], [], []);
      expect(result.length).toBe(2);
    });

    it('should call the service function given list of monPlanIds', async () => {
      const result = await service.getEmissionsRecords([], ['MOCK'], []);
      expect(result.length).toBe(1);
    });
  });
});
