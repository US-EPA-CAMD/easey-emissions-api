import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EmissionSubmissionsProgressMap } from '../maps/emissions-submission-progress.map';
import { EmissionController } from './emissions.controller'
import { EmissionService } from './emissions.service';

describe('Emissions Controller', () => {
  let controller: EmissionController;
  let service: EmissionService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [EmissionController],
      providers: [
        EmissionService,
        EmissionSubmissionsProgressMap
      ],
    }).compile();

    controller = module.get(EmissionController);
    service = module.get(EmissionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get Methods', () => {
    it('should return the provided data', async () => {
      const data = undefined;

      jest.spyOn(service, 'getSubmissionProgress').mockResolvedValue(data);

      expect(await controller.submissionProgress('')).toBe(data);
    });
  });

});
