import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { WeeklySystemIntegrityImportDTO } from '../dto/weekly-system-integrity.dto';
import { WeeklyTestSummaryImportDTO } from '../dto/weekly-test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { WeeklyTestSummaryCheckService } from './weekly-test-summary-check.service';

describe("Weekly Test Summary Checks Service Tests", ()=>{

    let service: WeeklyTestSummaryCheckService;
    let baseWTSTestObj: WeeklyTestSummaryImportDTO;
    let baseEmissionsImportTestObj: EmissionsImportDTO;

    beforeEach(async ()=>{
        const module = await Test.createTestingModule({
            imports: [LoggerModule],
            providers: [WeeklyTestSummaryCheckService]
        }).compile();

        service = module.get(WeeklyTestSummaryCheckService);
        baseWTSTestObj = new WeeklyTestSummaryImportDTO();

        baseEmissionsImportTestObj = new EmissionsImportDTO();
    });

    describe("test inappropriateChildrenRecordsCheck()", ()=>{

        it('should return error message for import-38', ()=>{
            const testObj: WeeklyTestSummaryImportDTO  = {...baseWTSTestObj};
            testObj.testTypeCode = TestTypeCodes.APPE;

            testObj.weeklySystemIntegrityData = [new WeeklySystemIntegrityImportDTO()]
            const result = service.inappropriateChildrenRecordsCheck(testObj);

            expect(result).toEqual(`You have reported WeeklySystemIntegrity records for a Weekly Test Summary Record with a Test Type Code of [${testObj.testTypeCode}]. This File was not imported.`);
        })

        it( 'should return null when weeklySystemIntegrityData is empty', ()=>{
            const testObj: WeeklyTestSummaryImportDTO  = {...baseWTSTestObj};
            testObj.testTypeCode = TestTypeCodes.HGSI1;

            testObj.weeklySystemIntegrityData = [];
            const result = service.inappropriateChildrenRecordsCheck(testObj);
            expect(result).toBeNull()
        })
    });

    describe("test runChecks()", ()=>{

        it('should return an empty list', ()=>{
            const emissionsImport = {...baseEmissionsImportTestObj};
            emissionsImport.weeklyTestSummaryData = [{...baseWTSTestObj}];
            const result = service.runChecks(emissionsImport);
            expect(result.length).toBe(0)
        })
    });
})