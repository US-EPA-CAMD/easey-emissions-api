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
import * as importNsps4tSummaryData from '../nsps4t-summary-functions/import-nsps4t-summary-data';
import { Nsps4tSummaryDataCreate } from '../nsps4t-summary-functions/import-nsps4t-summary-data';

describe('Nsps4tSummaryWorkspaceNewService', () => {
  let service: Nsps4tSummaryWorkspaceService;
  let repository: Nsps4tSummaryWorkspaceRepository;
  let annualService: Nsps4tAnnualWorkspaceService;
  let compliancePeriodService: Nsps4tCompliancePeriodWorkspaceService;
  let map: Nsps4tSummaryMap;

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
      ],
    }).compile();

    service = module.get<Nsps4tSummaryWorkspaceService>(
      Nsps4tSummaryWorkspaceService,
    );
    repository = module.get(Nsps4tSummaryWorkspaceRepository);
    annualService = module.get(Nsps4tAnnualWorkspaceService);
    compliancePeriodService = module.get(Nsps4tCompliancePeriodWorkspaceService);
    map = module.get(Nsps4tSummaryMap);

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

    jest
      .spyOn(annualService, 'export')
      .mockResolvedValue([]);

    jest
      .spyOn(compliancePeriodService, 'export')
      .mockResolvedValue([]);

    await expect(
      service.export([], new EmissionsParamsDTO()),
    ).resolves.toEqual(mappedValues);
  });

  it('should successfully import', async function () {
    const importMock = genNsps4tSummary<Nsps4tSummary>(1, { include: ["nsps4tFourthQuarterData", "nsps4tCompliancePeriodData"], nsps4tCompliancePeriodDataAmount: 1, nsps4tAnnualDataAmount: 1 });

    jest.spyOn(importNsps4tSummaryData, 'importNsps4tSummaryData').mockResolvedValue(importMock[0]);
    jest.spyOn(annualService, 'import').mockResolvedValue(importMock[0].nsps4tFourthQuarterData[0]);
    jest.spyOn(compliancePeriodService, 'import').mockResolvedValue(importMock[0].nsps4tCompliancePeriodData[0]);

    await expect(
      service.import(
        (importMock[0] as unknown) as Nsps4tSummaryDataCreate,
      ),
    ).resolves.toEqual(importMock[0]);
  });


});
