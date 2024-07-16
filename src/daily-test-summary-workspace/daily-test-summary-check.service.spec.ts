import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DailyCalibrationImportDTO } from '../dto/daily-calibration.dto';
import { DailyTestSummaryImportDTO } from '../dto/daily-test-summary.dto';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { DailyTestSummaryCheckService } from './daily-test-summary-check.service';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { DailyTestSummaryWorkspaceRepository } from './daily-test-summary.repository';
import { mockDailyTestSummaryWorkspaceRepository } from '../../test/mocks/mock-daily-test-summary-workspace-repository';
import { PlantRepository } from '../plant/plant.repository';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { mockQueryBuilder } from '../../test/mocks/mock-query-builder';


describe('Daily Test Summary Checks Service Tests', () => {
  let service: DailyTestSummaryCheckService;
  let baseDTSTestObj: DailyTestSummaryImportDTO;
  let baseEmissionsImportTestObj: EmissionsImportDTO;
  let repository: PlantRepository;
  let queryBuilder: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [DailyTestSummaryCheckService, EntityManager, PlantRepository,
        {
        provide: DailyTestSummaryWorkspaceRepository,
        useValue: mockDailyTestSummaryWorkspaceRepository,
        },
        {
          provide: SelectQueryBuilder,
          useValue: mockQueryBuilder,
        },
      ],
    }).compile();

    service = module.get(DailyTestSummaryCheckService);
    baseDTSTestObj = new DailyTestSummaryImportDTO();

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
    it('should return error message for import-29', () => {
      CheckCatalogService.formatResultMessage = () => undefined;

      const testObj: DailyTestSummaryImportDTO = { ...baseDTSTestObj };
      testObj.testTypeCode = TestTypeCodes.APPE;

      testObj.dailyCalibrationData = [new DailyCalibrationImportDTO()];
      const result = service.inappropriateChildrenRecordsCheck(testObj);

      expect(result).toEqual(undefined);
    });

    it('should return null when dailyCalibrationData is empty', () => {
      const testObj: DailyTestSummaryImportDTO = { ...baseDTSTestObj };
      testObj.testTypeCode = TestTypeCodes.HGSI1;

      testObj.dailyCalibrationData = [];
      let result = service.inappropriateChildrenRecordsCheck(testObj);
      expect(result).toBeNull();

      testObj.dailyCalibrationData = undefined;
      result = service.inappropriateChildrenRecordsCheck(testObj);
      expect(result).toBeNull();
    });
  });

  describe('test runChecks()', () => {
    it('should return an empty list', () => {
      const emissionsImport = { ...baseEmissionsImportTestObj };
      emissionsImport.dailyTestSummaryData = [{ ...baseDTSTestObj }];
      const result = service.runChecks(emissionsImport);
      expect(result.length).toBe(1);
    });
  });
});
