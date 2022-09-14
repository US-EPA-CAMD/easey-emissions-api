import { Test } from '@nestjs/testing';

import { HourlyOperatingWorkspaceService } from './hourly-operating.service';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { MonitorHourlyValueWorkspaceService } from '../monitor-hourly-value-workspace/monitor-hourly-value.service';
import { MonitorHourlyValueWorkspaceRepository } from '../monitor-hourly-value-workspace/monitor-hourly-value.repository';
import { HourlyOperatingWorkspaceRepository } from './hourly-operating.repository';
import { MatsMonitorHourlyValueWorkspaceService } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.service';
import { MatsMonitorHourlyValueWorkspaceRepository } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.repository';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { MatsDerivedHourlyValueWorkspaceService } from '../mats-derived-hourly-value-workspace/mats-derived-hourly-value.service';
import { MatsDerivedHourlyValueWorkspaceRepository } from '../mats-derived-hourly-value-workspace/mats-derived-hourly-value.repository';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { DerivedHourlyValueWorkspaceService } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.service';
import { DerivedHourlyValueWorkspaceRepository } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.repository';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { genHourlyOpValues } from '../../test/object-generators/hourly-op-data-values';
import { genDerivedHrlyValues } from '../../test/object-generators/derived-hourly-value';
import { HrlyOpData } from '../entities/workspace/hrly-op-data.entity';
import { MonitorHourlyValueDTO } from '../dto/monitor-hourly-value.dto';
import { DerivedHrlyValue } from '../entities/workspace/derived-hrly-value.entity';
import { MatsMonitorHourlyValueDTO } from '../dto/mats-monitor-hourly-value.dto';
import { MatsDerivedHourlyValueDTO } from '../dto/mats-derived-hourly-value.dto';

const generatedHrlyOpValues = genHourlyOpValues<HrlyOpData>(1, {
  include: [
    'monitorLocation',
    'derivedHrlyValues',
    'matsMonitorHourlyValues',
    'matsDerivedHourlyValues',
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

describe('HourlyOperatingWorskpaceService', () => {
  let service: HourlyOperatingWorkspaceService;
  let repository: any;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DerivedHourlyValueMap,
        HourlyOperatingWorkspaceService,
        HourlyOperatingMap,
        MonitorHourlyValueWorkspaceRepository,
        MonitorHourlyValueMap,
        MatsMonitorHourlyValueWorkspaceRepository,
        MatsMonitorHourlyValueMap,
        MatsDerivedHourlyValueWorkspaceRepository,
        MatsDerivedHourlyValueMap,
        {
          provide: DerivedHourlyValueWorkspaceRepository,
          useValue: jest,
        },
        {
          provide: MonitorHourlyValueWorkspaceService,
          useValue: mockMonitorHourlyValueService,
        },
        {
          provide: DerivedHourlyValueWorkspaceService,
          useFactory: mockDerivedHourlyValueService,
        },
        {
          provide: MatsMonitorHourlyValueWorkspaceService,
          useValue: mockMatsMonitorHourlyValueService,
        },
        {
          provide: MatsDerivedHourlyValueWorkspaceService,
          useValue: mockMatsDerivedHourlyValueService,
        },
        {
          provide: HourlyOperatingWorkspaceRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(HourlyOperatingWorkspaceService);
    repository = module.get(HourlyOperatingWorkspaceRepository);
    map = module.get(HourlyOperatingMap);
  });

  describe('export', () => {
    it('service should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should export Hourly OP workspace Data', async () => {
      const filters = new EmissionsParamsDTO();
      const result = await service.export(['123'], filters);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].derivedHourlyValue.length).toBeGreaterThan(0);
    });
  });
});
