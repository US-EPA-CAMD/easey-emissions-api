import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { EmissionsController } from './emissions.controller';
import { EmissionsSubmissionsProgressRepository } from './emissions-submissions-progress.repository';
import { EmissionsService } from './emissions.service';

const mockEmissionsRepository = () => ({
  getSubmissionProgress: jest.fn(),
});

describe('Emissions Controller', () => {
  let controller: EmissionsController;
  let service: EmissionsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [EmissionsController],
      providers: [
        EmissionsService,
        EmissionsSubmissionsProgressMap,
        ConfigService,
        { provide: EmissionsSubmissionsProgressRepository, useFactory: mockEmissionsRepository },
      ],
    }).compile();

    controller = module.get(EmissionsController);
    service = module.get(EmissionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get Methods', () => {
    it('should return the provided data', async () => {
      const data = undefined;

      jest.spyOn(service, 'getSubmissionProgress').mockResolvedValue(data);

      expect(
        await controller.submissionProgress({ submissionPeriod: new Date() }),
      ).toBe(data);
    });
  });
});
