import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { ReviewAndSubmitMultipleParamsDTO } from '../dto/review-and-submit-multiple-params.dto';
import { EmissionsReviewSubmitDTO } from '../dto/emissions-review-submit.dto';

import { ReviewSubmitController } from './ReviewSubmit.controller';
import { ReviewSubmitService } from './ReviewSubmit.service';

const mockService = () => ({
  getEmissionsRecords: jest.fn(),
});

describe('ReviewSubmitController', () => {
  let controller: ReviewSubmitController;
  let service: ReviewSubmitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [ReviewSubmitController],
      providers: [
        {
          provide: ReviewSubmitService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<ReviewSubmitController>(ReviewSubmitController);
    service = module.get<ReviewSubmitService>(ReviewSubmitService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEmissions', () => {
    it('should call the review and submit test summary controller function and return a list of dtos', async () => {
      const dto = new EmissionsReviewSubmitDTO();
      service.getEmissionsRecords = jest.fn().mockResolvedValue([dto]);

      const result = await controller.getEmissions(
        new ReviewAndSubmitMultipleParamsDTO(),
      );

      expect(result).toEqual([dto]);
    });
  });
});
