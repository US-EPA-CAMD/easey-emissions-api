import { Test, TestingModule } from '@nestjs/testing';
import { SorbentTrapWorkspaceService } from './sorbent-trap-workspace.service';
import { SamplingTrainWorkspaceService } from '../sampling-train-workspace/sampling-train-workspace.service';
import { SamplingTrainWorkspaceRepository } from '../sampling-train-workspace/sampling-train-workspace.repository';
import { SorbentTrapWorkspaceRepository } from './sorbent-trap-workspace.repository';
import { ComponentRepository } from '../component/component.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { SorbentTrapMap } from '../maps/sorbent-trap.map';
import { genSorbentTrap } from '../../test/object-generators/sorbent-trap';
import { SorbentTrap } from '../entities/workspace/sorbent-trap.entity';
import * as exportSorbentTrapData from '../sorbent-trap-functions/export-sorbent-trap-data';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import * as importSorbentTrapData from '../sorbent-trap-functions/import-sorbent-trap-data';
import { SorbentTrapWorkspaceCreate } from '../sorbent-trap-functions/import-sorbent-trap-data';
import { genSorbentTrapImportDto } from '../../test/object-generators/sorbent-trap-dto';

describe('SorbentTrapWorkspaceService', () => {
  let service: SorbentTrapWorkspaceService;
  let samplingTrainService: SamplingTrainWorkspaceService;
  let map: SorbentTrapMap;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComponentRepository,
        MonitorSystemRepository,
        SamplingTrainWorkspaceService,
        SorbentTrapWorkspaceService,
        SamplingTrainWorkspaceRepository,
        SorbentTrapWorkspaceRepository,
        SorbentTrapMap,
      ],
    }).compile();

    service = module.get<SorbentTrapWorkspaceService>(SorbentTrapWorkspaceService);
    samplingTrainService = module.get(SamplingTrainWorkspaceService);
    map = module.get(SorbentTrapMap);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should export data', async () => {
    const mockedValues = genSorbentTrap<SorbentTrap>(1, { include: ['samplingTrains'], samplingTrainAmount: 1 });
    const mappedValues = await map.many(mockedValues);

    jest.spyOn(exportSorbentTrapData, 'exportSorbentTrapData').mockResolvedValue(mappedValues);
    jest.spyOn(samplingTrainService, 'export').mockResolvedValue(mappedValues[0].samplingTrainData);

    await expect(
      service.export([], new EmissionsParamsDTO()),
    ).resolves.toEqual(mappedValues);
  });

  it('should successfully import', async function () {
    const mockedValues = genSorbentTrap<SorbentTrap>(1, { include: ['samplingTrains'], samplingTrainAmount: 1 });

    // need to massage the data to make it look like import dto
    const importValue = ({...mockedValues[0]}as unknown) as SorbentTrapWorkspaceCreate;
    delete importValue["samplingTrains"]
    importValue.samplingTrainData = [{...mockedValues[0].samplingTrains[0]}];

    const mappedValues = await map.many(mockedValues);
    jest.spyOn(importSorbentTrapData, 'importSorbentTrapData').mockResolvedValue(mockedValues[0]);
    jest.spyOn(samplingTrainService, 'import').mockResolvedValue(mockedValues[0].samplingTrains[0]);

    await expect(
      service.import(
        importValue,
      ),
    ).resolves.toEqual(mockedValues[0]);
  });

});
