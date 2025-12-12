import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { ReviewSubmitService } from './ReviewSubmit.service';
import { EmissionsReviewMap } from '../maps/emissions-review.map';
import { EmissionsReviewDTO } from '../dto/emissions-review.dto';
import { DataSource, EntityManager } from 'typeorm';

jest.mock('@us-epa-camd/easey-common', () => {
  const mockWithSlaveConnection = jest.fn().mockImplementation((dataSource, callback) => {
    const mockEntityManager = {
      find: jest.fn().mockImplementation((entity, args) => {
        const hasMonPlanId = !!args.where.monPlanId;
        const hasPeriodAbbreviation = args.where.hasOwnProperty('periodAbbreviation');

        if (hasMonPlanId) {
          if (hasPeriodAbbreviation) {
            return Promise.resolve([]);
          } else {
            return Promise.resolve([new EmissionsReviewDTO()]);
          }
        } else if (hasPeriodAbbreviation) {
          return Promise.resolve([new EmissionsReviewDTO(), new EmissionsReviewDTO()]);
        }
        return Promise.resolve([new EmissionsReviewDTO(), new EmissionsReviewDTO(), new EmissionsReviewDTO()]);
      }),
    };
    return callback(mockEntityManager as any);
  });

  return {
    withSlaveConnection: mockWithSlaveConnection,
  };
});

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
  let service: ReviewSubmitService;
  let entityManager: EntityManager;

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

    service = module.get<ReviewSubmitService>(ReviewSubmitService);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
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

    it('should call the service function given list of quarters and monPlanIds', async () => {
      const result = await service.getEmissionsRecords({
        orisCodes: [3],
        monPlanIds: ['MOCK'],
        quarters: ["Q3"],
      });
      expect(result.length).toBe(0);
    });
  });
});
