import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { CodeChecksService } from './code-checks.service';
import { genEmissionsImportDto } from '../../test/object-generators/emissions-dto';
import { BaseEntity, EntityManager } from 'typeorm';
import * as typeorm_functions from 'typeorm/globals';

describe('Code Checks Service Tests', () => {
    let service: CodeChecksService;
    
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        imports: [LoggerModule],
        providers: [CodeChecksService],
      }).compile();
  
      service = module.get(CodeChecksService);  
    });
  
    it('tests runChecks()', async () => {
        jest.spyOn(BaseEntity, 'getRepository').mockImplementation(jest.fn().mockReturnValue({metadata:{tableName:"table", primaryColumns:[{databaseName:"primaryCol"}]}}));

        jest.spyOn(typeorm_functions, 'getManager').mockReturnValue(({
            query: jest.fn().mockResolvedValue([{column1: ["invalidCode"]}]),
          } as unknown) as EntityManager);
      
        const mockedPayload = genEmissionsImportDto(1, {include:["weeklyTestSummaryData", "dailyTestSummaryData", "hourlyOperatingData"]}) 

        const results = await service.runChecks(mockedPayload[0]);
        expect(results.length).toBe(6)
    });  
  });