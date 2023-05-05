import { Test, TestingModule } from '@nestjs/testing';
import { DailyEmissionWorkspaceService } from './daily-emission-workspace.service';
import { DailyEmissionWorkspaceRepository } from './daily-emission-workspace.repository';
import { DailyFuelWorkspaceService } from '../daily-fuel-workspace/daily-fuel-workspace.service';
import { DailyFuelWorkspaceRepository } from '../daily-fuel-workspace/daily-fuel-workspace.repository';
import { genDailyEmission } from '../../test/object-generators/daily-emission';
import { DailyEmission } from '../entities/workspace/daily-emission.entity';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { DailyFuelDTO } from '../dto/daily-fuel.dto';
import { DailyEmissionDTO } from '../dto/daily-emission.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DailyFuel } from '../entities/workspace/daily-fuel.entity';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { ConfigService } from '@nestjs/config';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

describe('DailyEmissionWorkspaceService', () => {
  let map: DailyEmissionMap;
  let service: DailyEmissionWorkspaceService;
  let repository: DailyEmissionWorkspaceRepository;
  let bulkLoadService: BulkLoadService;
  let exportModule: typeof import('../daily-emission-functions/export-daily-emission-data');

  const mockDailyFuelWorkspaceService = {
    export: () => Promise.resolve([new DailyFuelDTO()]),
    import: () => Promise.resolve([new DailyFuel()])
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyFuelMap,
        DailyEmissionMap,
        DailyEmissionWorkspaceService,
        DailyEmissionWorkspaceRepository,
        DailyFuelWorkspaceRepository,
        BulkLoadService,
        ConfigService,
        {
          provide: DailyFuelWorkspaceService,
          useValue: mockDailyFuelWorkspaceService,
        }
      ],
    }).compile();

    service = module.get<DailyEmissionWorkspaceService>(
      DailyEmissionWorkspaceService,
    );
    repository = module.get(DailyEmissionWorkspaceRepository);
    map = module.get(DailyEmissionMap);

    bulkLoadService = module.get(BulkLoadService);
    exportModule = await import(
      '../daily-emission-functions/export-daily-emission-data'
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('import', () => {
    it('should import a record', async function() {
      const dailyEmission = genDailyEmission<DailyEmission>(1, {include:['dailyFuelData']});
      const importData = await map.many(dailyEmission);

      // @ts-expect-error use as mock
      jest.spyOn(bulkLoadService, 'startBulkLoader').mockResolvedValue({
        writeObject: jest.fn(),
        complete: jest.fn(),
        finished: Promise.resolve(true)
      });

      const emissionsDto = new EmissionsImportDTO();
      emissionsDto.dailyEmissionData = importData;

      const locations = [{ unit: { name: "a" }, id: 1 }]
      importData[0].unitId = "a";
      const identifiers = {
        components: [],
        monitorFormulas: [],
        monitoringSystems: [],
        userId: "",
      } as unknown as ImportIdentifiers;

      await expect(service.import(emissionsDto, locations, "", identifiers, "")).resolves;

    //   await expect(
    //     service.import({
    //       ...dailyEmission,
    //       reportingPeriodId: faker.datatype.number(),
    //       monitoringLocationId: faker.datatype.string(),
    //       identifiers: {
    //         components: {},
    //         monitorFormulas: {},
    //         monitoringSystems: {},
    //       },
    //     }),
    //   ).resolves.toEqual(dailyEmission);
    });
  });

  describe('export', ()=>{
    it( 'should successfully export', async ()=>{
      jest.spyOn(exportModule, 'exportDailyEmissionData').mockResolvedValue([new DailyEmissionDTO()]);
      const result = await service.export([], new EmissionsParamsDTO());
  
      expect(result.length).toEqual(1)
      expect(result[0].dailyFuelData.length).toEqual(1)
    })
  })
});
