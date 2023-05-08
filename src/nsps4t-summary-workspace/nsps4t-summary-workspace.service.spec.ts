import { Test, TestingModule } from '@nestjs/testing';
import { Nsps4tSummaryWorkspaceService } from './nsps4t-summary-workspace.service';
import { Nsps4tSummaryWorkspaceRepository } from './nsps4t-summary-workspace.repository';
import { Nsps4tAnnualWorkspaceService } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.service';
import { Nsps4tAnnualWorkspaceRepository } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.repository';
import { Nsps4tCompliancePeriodWorkspaceService } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.service';
import { Nsps4tCompliancePeriodWorkspaceRepository } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.repository';
import { Nsps4tSummary } from '../entities/workspace/nsps4t-summary.entity';
import { genNsps4tSummary } from '../../test/object-generators/nsps4t-summary';
import { Nsps4tSummaryMap } from '../maps/nsps4t-summary.map';
import * as exportNsps4tSummaryData from '../nsps4t-summary-functions/export-nsps4t-summary-data';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { ConfigService } from '@nestjs/config';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

describe('Nsps4tSummaryWorkspaceNewService', () => {
  let service: Nsps4tSummaryWorkspaceService;
  let repository: Nsps4tSummaryWorkspaceRepository;
  let annualService: Nsps4tAnnualWorkspaceService;
  let compliancePeriodService: Nsps4tCompliancePeriodWorkspaceService;
  let map: Nsps4tSummaryMap;
  let bulkLoadService: BulkLoadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Nsps4tAnnualWorkspaceRepository,
        Nsps4tAnnualWorkspaceService,
        Nsps4tCompliancePeriodWorkspaceRepository,
        Nsps4tCompliancePeriodWorkspaceService,
        Nsps4tSummaryWorkspaceRepository,
        Nsps4tSummaryWorkspaceService,
        Nsps4tSummaryMap,
        BulkLoadService,
        ConfigService,
      ],
    }).compile();

    service = module.get<Nsps4tSummaryWorkspaceService>(
      Nsps4tSummaryWorkspaceService,
    );
    repository = module.get(Nsps4tSummaryWorkspaceRepository);
    annualService = module.get(Nsps4tAnnualWorkspaceService);
    compliancePeriodService = module.get(
      Nsps4tCompliancePeriodWorkspaceService,
    );
    map = module.get(Nsps4tSummaryMap);
    bulkLoadService = module.get(BulkLoadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should export mapped data', async () => {
    const nsps4tSummaryMock = genNsps4tSummary<Nsps4tSummary>();
    const mappedValues = await map.many(nsps4tSummaryMock);

    jest
      .spyOn(exportNsps4tSummaryData, 'exportNsps4tSummaryData')
      .mockResolvedValue(mappedValues);

    jest.spyOn(annualService, 'export').mockResolvedValue([]);

    jest.spyOn(compliancePeriodService, 'export').mockResolvedValue([]);

    await expect(service.export([], new EmissionsParamsDTO())).resolves.toEqual(
      mappedValues,
    );
  });

  it('should successfully import', async function() {
    const entityMocks = genNsps4tSummary<Nsps4tSummary>(1, {
      include: ['nsps4tAnnualData', 'nsps4tCompliancePeriodData'],
      nsps4tCompliancePeriodDataAmount: 1,
      nsps4tAnnualDataAmount: 1,
    });
    const nsps4tSummaryData = await map.many(entityMocks);

    //@ts-expect-error as mock
    jest.spyOn(bulkLoadService, 'startBulkLoader').mockResolvedValue({
      writeObject: jest.fn(),
      complete: jest.fn(),
      finished: Promise.resolve(true),
    });

    const emissionsDto = new EmissionsImportDTO();
    emissionsDto.nsps4tSummaryData = nsps4tSummaryData;

    const locations = [{ unit: { name: '1' }, id: 1 }];

    nsps4tSummaryData[0].unitId = '1';
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
