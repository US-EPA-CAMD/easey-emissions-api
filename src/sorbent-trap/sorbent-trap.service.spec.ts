import { Test, TestingModule } from '@nestjs/testing';
import { SorbentTrapService } from './sorbent-trap.service';
import { SorbentTrapRepository } from './sorbent-trap.repository';
import { SamplingTrainService } from '../sampling-train/sampling-train.service';
import { SamplingTrainRepository } from '../sampling-train/sampling-train.repository';
import * as exportSorbentTrapData from '../sorbent-trap-functions/export-sorbent-trap-data';
import { genSorbentTrap } from '../../test/object-generators/sorbent-trap';
import { SorbentTrapMap } from '../maps/sorbent-trap.map';
import { SorbentTrap } from '../entities/sorbent-trap.entity';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

describe('SorbentTrapService', () => {
  let service: SorbentTrapService;
  let samplingTrainService: SamplingTrainService;
  let map: SorbentTrapMap;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SamplingTrainService,
        SamplingTrainRepository,
        SorbentTrapService,
        SorbentTrapRepository,
        SorbentTrapMap,
      ],
    }).compile();

    service = module.get<SorbentTrapService>(SorbentTrapService);
    map = module.get(SorbentTrapMap);
    samplingTrainService = module.get(SamplingTrainService);
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
});
