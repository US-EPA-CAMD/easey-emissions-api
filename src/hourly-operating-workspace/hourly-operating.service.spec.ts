import { Test } from '@nestjs/testing';

import {
  HourlyOperatingWorkspaceService,
  HourlyOperatingCreate,
} from './hourly-operating.service';
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
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { HourlyGasFlowMeterWorkspaceRepository } from '../hourly-gas-flow-meter-workspace/hourly-gas-flow-meter.repository';
import { HourlyGasFlowMeterWorkspaceService } from '../hourly-gas-flow-meter-workspace/hourly-gas-flow-meter.service';
import { HourlyGasFlowMeterDTO } from '../dto/hourly-gas-flow-meter.dto';
import { HourlyFuelFlowWorkspaceService } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.service';
import { HourlyFuelFlowWorkspaceRepository } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.repository';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowWorkspaceService } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.service';
import { HourlyParameterFuelFlowWorkspaceRepository } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.repository';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { HourlyOperatingImportDTO } from '../dto/hourly-operating.dto';
import { MonitorLocation } from '../entities/monitor-location.entity';

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
  create: () => jest,
  delete: jest.fn().mockResolvedValue(undefined),
  save: jest.fn().mockResolvedValue(undefined),
};

const mockMonitorHourlyValueService = {
  export: () => Promise.resolve([new MonitorHourlyValueDTO()]),
  import: jest.fn().mockResolvedValue(true),
};

const mockHourlyGasFlowMeterService = {
  export: () => Promise.resolve([new HourlyGasFlowMeterDTO()]),
  import: jest.fn().mockResolvedValue(true),
};

const mockDerivedHourlyValueService = () => {
  const generatedDerivedHrlyValues = genDerivedHrlyValues<DerivedHrlyValue>(1);
  generatedDerivedHrlyValues.forEach(d => {
    d.hourId = generatedHrlyOpValues[0].id;
  });
  return {
    export: () => Promise.resolve(generatedDerivedHrlyValues),
    import: jest.fn().mockResolvedValue(true),
  };
};

const mockMatsMonitorHourlyValueService = {
  export: () => Promise.resolve([new MatsMonitorHourlyValueDTO()]),
  import: jest.fn().mockResolvedValue(true),
};

const mockMatsDerivedHourlyValueService = {
  export: () => Promise.resolve([new MatsDerivedHourlyValueDTO()]),
  import: jest.fn().mockResolvedValue(true),
};

const writeObjectMock = jest.fn();

describe('HourlyOperatingWorskpaceService', () => {
  let service: HourlyOperatingWorkspaceService;
  let repository: any;
  let map;

  let monitorHourlyValueWorkspaceRepository: MonitorHourlyValueWorkspaceRepository;
  let derivedHourlyValueRepository: DerivedHourlyValueWorkspaceRepository;
  let matsMonitorHourlyValueWorkspaceRepository: MatsMonitorHourlyValueWorkspaceRepository;
  let hourlyGasFlowMeterWorkspaceRepository: HourlyGasFlowMeterWorkspaceRepository;
  let hourlyFuelFlowWorkspaceRepository: HourlyFuelFlowWorkspaceRepository;

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
        HourlyGasFlowMeterMap,
        HourlyGasFlowMeterWorkspaceRepository,
        HourlyGasFlowMeterWorkspaceService,
        HourlyFuelFlowWorkspaceService,
        HourlyFuelFlowWorkspaceRepository,
        HourlyParameterFuelFlowMap,
        HourlyFuelFlowMap,
        HourlyParameterFuelFlowWorkspaceService,
        HourlyParameterFuelFlowWorkspaceRepository,
        HourlyOperatingWorkspaceRepository,
        DerivedHourlyValueWorkspaceRepository,
        {
          provide: BulkLoadService,
          useFactory: () => ({
            startBulkLoader: jest.fn().mockResolvedValue({
              writeObject: writeObjectMock,
              complete: jest.fn(),
              finished: true,
            }),
          }),
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
          provide: HourlyGasFlowMeterWorkspaceService,
          useValue: mockHourlyGasFlowMeterService,
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

    monitorHourlyValueWorkspaceRepository = module.get(
      MonitorHourlyValueWorkspaceRepository,
    );
    derivedHourlyValueRepository = module.get(
      DerivedHourlyValueWorkspaceRepository,
    );
    matsMonitorHourlyValueWorkspaceRepository = module.get(
      MatsMonitorHourlyValueWorkspaceRepository,
    );
    hourlyGasFlowMeterWorkspaceRepository = module.get(
      HourlyGasFlowMeterWorkspaceRepository,
    );
    hourlyFuelFlowWorkspaceRepository = module.get(
      HourlyFuelFlowWorkspaceRepository,
    );
  });

  describe('export', () => {
    it('service should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should export Hourly OP workspace Data', async () => {
      const filters = new EmissionsParamsDTO();

      jest
        .spyOn(monitorHourlyValueWorkspaceRepository, 'export')
        .mockResolvedValue(undefined);
      jest
        .spyOn(derivedHourlyValueRepository, 'export')
        .mockResolvedValue(undefined);
      jest
        .spyOn(matsMonitorHourlyValueWorkspaceRepository, 'export')
        .mockResolvedValue(undefined);
      jest
        .spyOn(hourlyGasFlowMeterWorkspaceRepository, 'export')
        .mockResolvedValue(undefined);
      jest
        .spyOn(hourlyFuelFlowWorkspaceRepository, 'export')
        .mockResolvedValue(undefined);

      const result = await service.export(['123'], filters);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].derivedHourlyValueData.length).toBeGreaterThan(0);
    });
  });

  describe('import', () => {
    it('should simulate the import of 2 new records', async () => {
      const dto = new EmissionsImportDTO();
      dto.hourlyOperatingData = [
        new HourlyOperatingImportDTO(),
        new HourlyOperatingImportDTO(),
      ];

      await service.import(
        dto,
        [MonitorLocation],
        1,
        {
          components: {},
          userId: '',
          monitorFormulas: {},
          monitoringSystems: {},
        },
        new Date().toISOString(),
      );

      expect(writeObjectMock).toHaveBeenCalledTimes(2);
    });
  });
});
