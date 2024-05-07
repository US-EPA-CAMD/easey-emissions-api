import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { genNsps4tSummary } from '../../test/object-generators/nsps4t-summary';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { Nsps4tSummary } from '../entities/nsps4t-summary.entity';
import { Nsps4tSummaryMap } from '../maps/nsps4t-summary.map';
import { Nsps4tAnnualRepository } from '../nsps4t-annual/nsps4t-annual.repository';
import { Nsps4tAnnualService } from '../nsps4t-annual/nsps4t-annual.service';
import { Nsps4tCompliancePeriodRepository } from '../nsps4t-compliance-period/nsps4t-compliance-period.repository';
import { Nsps4tCompliancePeriodService } from '../nsps4t-compliance-period/nsps4t-compliance-period.service';
import * as exportNsps4tSummaryData from '../nsps4t-summary-functions/export-nsps4t-summary-data';
import { Nsps4tSummaryRepository } from './nsps4t-summary.repository';
import { Nsps4tSummaryService } from './nsps4t-summary.service';

describe('Nsps4tSummaryService', () => {
  let service: Nsps4tSummaryService;
  let repository: Nsps4tSummaryRepository;
  let annualService: Nsps4tAnnualService;
  let compliancePeriodService: Nsps4tCompliancePeriodService;

  let map: Nsps4tSummaryMap;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntityManager,
        Nsps4tAnnualRepository,
        Nsps4tAnnualService,
        Nsps4tCompliancePeriodRepository,
        Nsps4tCompliancePeriodService,
        Nsps4tSummaryRepository,
        Nsps4tSummaryService,
        Nsps4tSummaryMap,
      ],
    }).compile();

    service = module.get<Nsps4tSummaryService>(Nsps4tSummaryService);
    annualService = module.get(Nsps4tAnnualService);
    compliancePeriodService = module.get(Nsps4tCompliancePeriodService);

    repository = module.get(Nsps4tSummaryRepository);
    map = module.get(Nsps4tSummaryMap);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should export mapped data', async function() {
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
});
