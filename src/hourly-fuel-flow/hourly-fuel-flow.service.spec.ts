import { Test, TestingModule } from '@nestjs/testing';
import { HourlyFuelFlowService } from './hourly-fuel-flow.service';
import { HourlyFuelFlowRepository } from './hourly-fuel-flow.repository';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowService } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.service';
import { HourlyParameterFuelFlowRepository } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.repository';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';

describe('HourlyFuelFlowService', () => {
  let service: HourlyFuelFlowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HourlyFuelFlowService,
        HourlyFuelFlowRepository,
        HourlyFuelFlowMap,
        HourlyParameterFuelFlowService,
        HourlyParameterFuelFlowRepository,
        HourlyParameterFuelFlowMap,
      ],
    }).compile();

    service = module.get<HourlyFuelFlowService>(HourlyFuelFlowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('export', () => {
    it('should return null given no fuel flows were found', async function() {
      await expect(service.export([])).resolves.toEqual([]);
    });

    it('should return the correct shape of data given correct inputs', function() {});
  });
});
