import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { DailyFuelRepository } from '../daily-fuel/daily-fuel.repository';
import { DailyFuelService } from '../daily-fuel/daily-fuel.service';
import { DailyEmissionDTO } from '../dto/daily-emission.dto';
import { DailyFuelDTO } from '../dto/daily-fuel.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DailyEmissionRepository } from './daily-emission.repository';
import { DailyEmissionService } from './daily-emission.service';

describe('DailyEmissionDataService', () => {
  let service: DailyEmissionService;
  let exportModule: typeof import('../daily-emission-functions/export-daily-emission-data');

  const mockDailyFuelService = {
    export: () => Promise.resolve([new DailyFuelDTO()]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyEmissionService,
        DailyEmissionRepository,
        DailyFuelService,
        DailyFuelRepository,
        EntityManager,
        {
          provide: DailyFuelService,
          useValue: mockDailyFuelService,
        },
      ],
    }).compile();
    service = module.get<DailyEmissionService>(DailyEmissionService);
    exportModule = await import(
      '../daily-emission-functions/export-daily-emission-data'
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully export', async () => {
    jest
      .spyOn(exportModule, 'exportDailyEmissionData')
      .mockResolvedValue([new DailyEmissionDTO()]);
    const result = await service.export([], new EmissionsParamsDTO());

    expect(result.length).toEqual(1);
    expect(result[0].dailyFuelData.length).toEqual(1);
  });
});
