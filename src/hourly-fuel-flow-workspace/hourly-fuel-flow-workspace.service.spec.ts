import { Test, TestingModule } from '@nestjs/testing';
import { HourlyFuelFlowWorkspaceService } from './hourly-fuel-flow-workspace.service';
import { HourlyFuelFlowWorkspaceRepository } from './hourly-fuel-flow-workspace.repository';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowWorkspaceService } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.service';
import { HourlyParameterFuelFlowWorkspaceRepository } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.repository';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { genHourlyOperatingImportDto } from '../../test/object-generators/hourly-operating-dto';
import { genHourlyFuelFlow } from '../../test/object-generators/hourly-fuel-flow';
import { HrlyFuelFlow } from '../entities/workspace/hrly-fuel-flow.entity';
import { HourlyFuelFlowImportDTO } from '../dto/hourly-fuel-flow.dto';
import { mockHourlyFuelFlowWorkspaceRepository } from '../../test/mocks/mock-hourly-fuel-flow-workspace-repository';

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

  describe('import', () => {
    it('should import a record', async () => {
      const fuelFlowImport = genHourlyFuelFlow<HrlyFuelFlow>(1);
      const hourlyOperatingImport = genHourlyOperatingImportDto()[0];

      const mappedMock = await map.one(fuelFlowImport[0]);
      jest.spyOn(repository, 'save').mockResolvedValue(fuelFlowImport[0]);

      await expect(
        service.import(
          (fuelFlowImport[0] as unknown) as HourlyFuelFlowImportDTO,
          hourlyOperatingImport,
          '12345',
          '1',
          123,
          {
            components: {},
            monitoringSystems: {},
            monitorFormulas: {},
          },
        ),
      ).resolves.toEqual(mappedMock);
    });
  });

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
