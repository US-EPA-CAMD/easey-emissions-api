import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EntityManager } from 'typeorm';

import { genSorbentTrap } from '../../test/object-generators/sorbent-trap';
import { ComponentRepository } from '../component/component.repository';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { SorbentTrap } from '../entities/workspace/sorbent-trap.entity';
import { SorbentTrapMap } from '../maps/sorbent-trap.map';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { SamplingTrainWorkspaceRepository } from '../sampling-train-workspace/sampling-train-workspace.repository';
import { SamplingTrainWorkspaceService } from '../sampling-train-workspace/sampling-train-workspace.service';
import * as exportSorbentTrapData from '../sorbent-trap-functions/export-sorbent-trap-data';
import { SorbentTrapWorkspaceRepository } from './sorbent-trap-workspace.repository';
import { SorbentTrapWorkspaceService } from './sorbent-trap-workspace.service';

describe('SorbentTrapWorkspaceService', () => {
  let service: SorbentTrapWorkspaceService;
  let samplingTrainService: SamplingTrainWorkspaceService;
  let map: SorbentTrapMap;
  let bulkLoadService: BulkLoadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntityManager,
        ComponentRepository,
        MonitorSystemRepository,
        SamplingTrainWorkspaceService,
        SorbentTrapWorkspaceService,
        SamplingTrainWorkspaceRepository,
        SorbentTrapWorkspaceRepository,
        SorbentTrapMap,
        BulkLoadService,
        ConfigService,
      ],
    }).compile();

    service = module.get<SorbentTrapWorkspaceService>(
      SorbentTrapWorkspaceService,
    );
    samplingTrainService = module.get(SamplingTrainWorkspaceService);
    map = module.get(SorbentTrapMap);
    bulkLoadService = module.get(BulkLoadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should export data', async () => {
    const mockedValues = genSorbentTrap<SorbentTrap>(1, {
      include: ['samplingTrains'],
      samplingTrainAmount: 1,
    });
    const mappedValues = await map.many(mockedValues);

    jest
      .spyOn(exportSorbentTrapData, 'exportSorbentTrapData')
      .mockResolvedValue(mappedValues);
    jest
      .spyOn(samplingTrainService, 'export')
      .mockResolvedValue(mappedValues[0].samplingTrainData);

    await expect(service.export([], new EmissionsParamsDTO())).resolves.toEqual(
      mappedValues,
    );
  });

  it('should successfully import', async function() {
    const mockedValues = genSorbentTrap<SorbentTrap>(1, {
      include: ['samplingTrains'],
      samplingTrainAmount: 1,
    });
    const sorbentTrapData = await map.many(mockedValues);

    //@ts-expect-error as mock
    jest.spyOn(bulkLoadService, 'startBulkLoader').mockResolvedValue({
      writeObject: jest.fn(),
      complete: jest.fn(),
      finished: Promise.resolve(true),
    });
    const emissionsDto = new EmissionsImportDTO();
    emissionsDto.sorbentTrapData = sorbentTrapData;

    const locations = [{ unit: { name: '1' }, id: 1 }];

    sorbentTrapData[0].unitId = '1';
    const identifiers = ({
      components: [],
      monitorFormulas: [],
      monitoringSystems: [],
      userId: '',
    } as unknown) as ImportIdentifiers;

    await expect(
      service.import(emissionsDto, locations, '1', identifiers, '2019-01-01'),
    ).resolves;
  });
});
