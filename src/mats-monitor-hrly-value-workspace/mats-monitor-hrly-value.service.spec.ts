import { Test, TestingModule } from '@nestjs/testing';
import { MatsMonitorHrlyValueService } from './mats-monitor-hrly-value.service';
import { MatsMonitorHrlyValueRepository } from './mats-monitor-hrly-value.repository';

const matsMonitorHrlyValueRepositoryMock = {
  export: () => null,
};

describe('MatsMonitorHrlyValueService', () => {
  let service: MatsMonitorHrlyValueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatsMonitorHrlyValueService,
        {
          provide: MatsMonitorHrlyValueRepository,
          useValue: matsMonitorHrlyValueRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<MatsMonitorHrlyValueService>(
      MatsMonitorHrlyValueService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should export a record', async function() {
    await expect(service.export(['123'])).resolves.toEqual(null);
  });
});
