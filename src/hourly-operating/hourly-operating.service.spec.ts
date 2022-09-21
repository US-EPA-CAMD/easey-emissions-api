import { Test } from '@nestjs/testing';

import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyOperatingService } from './hourly-operating.service';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { MonitorHourlyValueService } from '../monitor-hourly-value/monitor-hourly-value.service';
import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { MonitorHourlyValueRepository } from '../monitor-hourly-value/monitor-hourly-value.repository';
import { MatsMonitorHourlyValueService } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.service';
import { MatsMonitorHourlyValueRepository } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.repository';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { MatsDerivedHourlyValueRepository } from '../mats-derived-hourly-value/mats-derived-hourly-value.repository';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueService } from '../mats-derived-hourly-value/mats-derived-hourly-value.service';
import { DerivedHourlyValueService } from '../derived-hourly-value/derived-hourly-value.service';
import { DerivedHourlyValueRepository } from '../derived-hourly-value/derived-hourly-value.repository';
import { genHourlyOpValues } from '../../test/object-generators/hourly-op-data-values';
import { genDerivedHrlyValues } from '../../test/object-generators/derived-hourly-value';
import { HrlyOpData } from '../entities/workspace/hrly-op-data.entity';
import { DerivedHrlyValue } from '../entities/workspace/derived-hrly-value.entity';
import { MatsMonitorHourlyValueDTO } from '../dto/mats-monitor-hourly-value.dto';
import { MatsDerivedHourlyValueDTO } from '../dto/mats-derived-hourly-value.dto';
import { MonitorHourlyValueDTO } from '../dto/monitor-hourly-value.dto';
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { HourlyGasFlowMeterRepository } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.repository';
import { HourlyGasFlowMeterService } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.service';
import { HourlyGasFlowMeterDTO } from '../dto/hourly-gas-flow-meter.dto';

const generatedHrlyOpValues = genHourlyOpValues<HrlyOpData>(1, {
  include: [
    'monitorLocation',
    'derivedHrlyValues',
    'matsMonitorHourlyValues',
    'matsDerivedHourlyValues',
    'hrlyGasFlowMeters',
  ],
});

const mockRepository = {
  export: () => Promise.resolve(generatedHrlyOpValues),
};

const mockMonitorHourlyValueService = {
  export: () => Promise.resolve([new MonitorHourlyValueDTO()]),
};

const mockDerivedHourlyValueService = () => {
  const generatedDerivedHrlyValues = genDerivedHrlyValues<DerivedHrlyValue>(1);
  generatedDerivedHrlyValues.forEach(d => {
    d.hourId = generatedHrlyOpValues[0].id;
  });
  return {
    export: () => Promise.resolve(generatedDerivedHrlyValues),
  };
};

const mockMatsMonitorHourlyValueService = {
  export: () => Promise.resolve([new MatsMonitorHourlyValueDTO()]),
};

const mockMatsDerivedHourlyValueService = {
  export: () => Promise.resolve([new MatsDerivedHourlyValueDTO()]),
};

const mockHourlyGasFlowMeterService = {
  export: () => Promise.resolve([new HourlyGasFlowMeterDTO()]),
};

describe('HourlyOperatingService', () => {
  let service: HourlyOperatingService;
  let repository: any;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HourlyOperatingService,
        MonitorHourlyValueRepository,
        MonitorHourlyValueMap,
        MatsMonitorHourlyValueRepository,
        MatsMonitorHourlyValueMap,
        MatsDerivedHourlyValueService,
        MatsDerivedHourlyValueRepository,
        MatsDerivedHourlyValueMap,
        HourlyOperatingMap,
        HourlyOperatingRepository,
        HourlyGasFlowMeterMap,
        HourlyGasFlowMeterRepository,
        HourlyGasFlowMeterService,
        {
          provide: DerivedHourlyValueRepository,
          useValue: jest,
        },
        {
          provide: MonitorHourlyValueService,
          useValue: mockMonitorHourlyValueService,
        },
        {
          provide: DerivedHourlyValueService,
          useFactory: mockDerivedHourlyValueService,
        },
        {
          provide: MatsMonitorHourlyValueService,
          useValue: mockMatsMonitorHourlyValueService,
        },
        {
          provide: MatsDerivedHourlyValueService,
          useValue: mockMatsDerivedHourlyValueService,
        },
        {
          provide: HourlyGasFlowMeterService,
          useValue: mockHourlyGasFlowMeterService,
        },
        {
          provide: HourlyOperatingRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(HourlyOperatingService);
    repository = module.get(HourlyOperatingRepository);
    map = module.get(HourlyOperatingMap);
  });

  describe('hourly operating service export', () => {
    it('service should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should export Hourly OP Data', async () => {
      const filters = new EmissionsParamsDTO();
      const result = await service.export(['123'], filters);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].derivedHourlyValueData.length).toBeGreaterThan(0);
    });
  });
});
