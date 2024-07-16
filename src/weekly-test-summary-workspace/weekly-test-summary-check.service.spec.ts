import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { WeeklySystemIntegrityImportDTO } from '../dto/weekly-system-integrity.dto';
import { WeeklyTestSummaryImportDTO } from '../dto/weekly-test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { WeeklyTestSummaryCheckService } from './weekly-test-summary-check.service';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { WeeklyTestSummaryWorkspaceRepository } from './weekly-test-summary.repository';
import { PlantRepository } from '../plant/plant.repository';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { mockQueryBuilder } from '../../test/mocks/mock-query-builder';
import { mockWeeklyTestSummaryWorkspaceRepository } from '../../test/mocks/mock-weekly-test-summary-workspace-repository';

describe('Weekly Test Summary Checks Service Tests', () => {
  let service: WeeklyTestSummaryCheckService;
  let baseWTSTestObj: WeeklyTestSummaryImportDTO;
  let baseEmissionsImportTestObj: EmissionsImportDTO;
  let repository: PlantRepository;
  let queryBuilder: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, ],
      providers: [WeeklyTestSummaryCheckService, PlantRepository, EntityManager, PlantRepository, WeeklyTestSummaryWorkspaceRepository,
          {
            provide: SelectQueryBuilder,
            useValue: mockQueryBuilder,
          },
      ],
    }).compile();

    service = module.get(WeeklyTestSummaryCheckService);
    baseWTSTestObj = new WeeklyTestSummaryImportDTO();

    baseEmissionsImportTestObj = new EmissionsImportDTO();

    repository = module.get(PlantRepository);
    queryBuilder = module.get(SelectQueryBuilder);

    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.leftJoin.mockReturnValue(queryBuilder);
    queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);

    queryBuilder.getOne.mockResolvedValue('mockPlant');

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('test inappropriateChildrenRecordsCheck()', () => {
    it('should return error message for import-38', () => {
      const testObj: WeeklyTestSummaryImportDTO = { ...baseWTSTestObj };
      testObj.testTypeCode = TestTypeCodes.APPE;

      testObj.weeklySystemIntegrityData = [
        new WeeklySystemIntegrityImportDTO(),
      ];

      CheckCatalogService.formatResultMessage = () =>
        `[IMPORT-38] You have reported WeeklySystemIntegrity records for a Weekly Test Summary Record with a Test Type Code of [${testObj.testTypeCode}]. This File was not imported.`;

      const result = service.inappropriateChildrenRecordsCheck(testObj);

      expect(result).toEqual(
        `[IMPORT-38] You have reported WeeklySystemIntegrity records for a Weekly Test Summary Record with a Test Type Code of [${testObj.testTypeCode}]. This File was not imported.`,
      );
    });

    it('should return null when weeklySystemIntegrityData is empty', () => {
      const testObj: WeeklyTestSummaryImportDTO = { ...baseWTSTestObj };
      testObj.testTypeCode = TestTypeCodes.HGSI1;

      testObj.weeklySystemIntegrityData = [];
      const result = service.inappropriateChildrenRecordsCheck(testObj);
      expect(result).toBeNull();
    });
  });

  describe('test runChecks()', () => {
    it('should return an empty list', () => {
      const emissionsImport = { ...baseEmissionsImportTestObj };
      emissionsImport.weeklyTestSummaryData = [{ ...baseWTSTestObj }];
      const result = service.runChecks(emissionsImport);
      expect(result.length).toBe(1);
    });
  });
});
