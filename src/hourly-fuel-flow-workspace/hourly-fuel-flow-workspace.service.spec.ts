import { Test, TestingModule } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EntityManager } from 'typeorm';

import { mockHourlyFuelFlowWorkspaceRepository } from '../../test/mocks/mock-hourly-fuel-flow-workspace-repository';
import { genHourlyFuelFlow } from '../../test/object-generators/hourly-fuel-flow';
import { HrlyFuelFlow } from '../entities/workspace/hrly-fuel-flow.entity';
import { HourlyParameterFuelFlowWorkspaceRepository } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.repository';
import { HourlyParameterFuelFlowWorkspaceService } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.service';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyFuelFlowWorkspaceRepository } from './hourly-fuel-flow-workspace.repository';
import { HourlyFuelFlowWorkspaceService } from './hourly-fuel-flow-workspace.service';

const writeObjectMock = jest.fn();

describe('HourlyFuelFlowService Workspace', () => {
  let service: HourlyFuelFlowWorkspaceService;
  let map: HourlyFuelFlowMap;
  let repository: HourlyFuelFlowWorkspaceRepository;
  let parameterFuelFlowWorkspaceRepository: HourlyParameterFuelFlowWorkspaceRepository;

  const mockHourlyParamFuelFlowWorkspaceService = {
    export: () => Promise.resolve([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntityManager,
        HourlyFuelFlowWorkspaceService,
        {
          provide: HourlyFuelFlowWorkspaceRepository,
          useValue: mockHourlyFuelFlowWorkspaceRepository,
        },
        HourlyFuelFlowMap,
        {
          provide: HourlyParameterFuelFlowWorkspaceService,
          useValue: mockHourlyParamFuelFlowWorkspaceService,
        },
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
        HourlyParameterFuelFlowWorkspaceRepository,
        HourlyParameterFuelFlowMap,
      ],
    }).compile();

    service = module.get<HourlyFuelFlowWorkspaceService>(
      HourlyFuelFlowWorkspaceService,
    );
    repository = module.get(HourlyFuelFlowWorkspaceRepository);
    parameterFuelFlowWorkspaceRepository = module.get(
      HourlyParameterFuelFlowWorkspaceRepository,
    );
    map = module.get(HourlyFuelFlowMap);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /*
  describe('import', () => {
    it('should simulate the import of 2 new records', async () => {
      const params = [
        new HourlyFuelFlowImportDTO(),
        new HourlyFuelFlowImportDTO(),
      ];

      await service.import(params, '', '', 1, {
        components: {},
        userId: '',
        monitorFormulas: {},
        monitoringSystems: {},
      });

      expect(writeObjectMock).toHaveBeenCalledTimes(2);
    });
  });
  */

  describe('export', () => {
    it('should return null given no fuel flows were found', async function() {
      await expect(service.export([])).resolves.toEqual([]);
    });

    it('returns export record for hourly fuel flow', async () => {
      const mockedValues = genHourlyFuelFlow<HrlyFuelFlow>(1);
      const promises = [];
      mockedValues.forEach(value => {
        promises.push(map.one(value));
      });
      const mapppedValues = await Promise.all(promises);
      jest.spyOn(repository, 'export').mockResolvedValue(mockedValues);
      await expect(
        await service.export(
          mockedValues.map(value => {
            return value.hourId;
          }),
        ),
      ).toEqual(mapppedValues);
    });
  });
});
