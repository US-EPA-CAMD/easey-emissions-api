import { Test, TestingModule } from '@nestjs/testing';
import { HourlyOperatingController } from './hourly-operating.controller';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { DerivedHourlyValueRepository } from '../derived-hourly-value/derived-hourly-value.repository';
import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyFuelFlowRepository } from '../hourly-fuel-flow/hourly-fuel-flow.repository';
import { HourlyParameterFuelFlowRepository } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.repository';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowService } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.service';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyFuelFlowService } from '../hourly-fuel-flow/hourly-fuel-flow.service';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { DerivedHourlyValueService } from '../derived-hourly-value/derived-hourly-value.service';
import { HourlyOperatingService } from './hourly-operating.service';
import { genHourlyOpValues } from '../../test/object-generators/hourly-op-data-values';
import { HrlyOpData } from '../entities/hrly-op-data.entity';
import { genHourlyOperatingParamsDto } from '../../test/object-generators/hourly-operating-dto';
import { MonitorHourlyValueService } from '../monitor-hourly-value/monitor-hourly-value.service';
import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { MonitorHourlyValueRepository } from '../monitor-hourly-value/monitor-hourly-value.repository';
import { MatsMonitorHourlyValueService } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.service';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { MatsMonitorHourlyValueRepository } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.repository';
import { MatsDerivedHourlyValueService } from '../mats-derived-hourly-value/mats-derived-hourly-value.service';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueRepository } from '../mats-derived-hourly-value/mats-derived-hourly-value.repository';
import { HourlyGasFlowMeterService } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.service';
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { HourlyGasFlowMeterRepository } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.repository';

describe('HourlyOperatingController', () => {
  let controller: HourlyOperatingController;
  let map: HourlyOperatingMap;
  let exportModule: typeof import('../hourly-operating-functions/hourly-operating-export');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HourlyOperatingController],
      providers: [
        HourlyFuelFlowMap,
        HourlyGasFlowMeterService,
        HourlyGasFlowMeterMap,
        HourlyGasFlowMeterRepository,
        HourlyParameterFuelFlowService,
        HourlyParameterFuelFlowMap,
        HourlyFuelFlowService,
        DerivedHourlyValueMap,
        DerivedHourlyValueService,
        HourlyOperatingMap,
        HourlyOperatingService,
        DerivedHourlyValueRepository,
        HourlyOperatingRepository,
        HourlyFuelFlowRepository,
        HourlyParameterFuelFlowRepository,
        MatsDerivedHourlyValueService,
        MatsDerivedHourlyValueMap,
        MatsDerivedHourlyValueRepository,
        MatsMonitorHourlyValueService,
        MatsMonitorHourlyValueMap,
        MatsMonitorHourlyValueRepository,
        MonitorHourlyValueService,
        MonitorHourlyValueMap,
        MonitorHourlyValueRepository,
      ],
      exports: [HourlyOperatingMap, HourlyOperatingService],
    }).compile();

    controller = module.get<HourlyOperatingController>(
      HourlyOperatingController,
    );
    map = module.get(HourlyOperatingMap);
    exportModule = await import(
      '../hourly-operating-functions/hourly-operating-export'
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return mapped hourly operating data', async function() {
    const mockedHourlyOpData = genHourlyOpValues<HrlyOpData>(3);
    const mapped = await map.many(mockedHourlyOpData);
    jest
      .spyOn(exportModule, 'exportSupplementaryHourlyOperatingDataQuery')
      .mockResolvedValue(mockedHourlyOpData);

    await expect(
      controller.supplementaryExport(genHourlyOperatingParamsDto()[0]),
    ).resolves.toEqual(mapped);
  });
});
