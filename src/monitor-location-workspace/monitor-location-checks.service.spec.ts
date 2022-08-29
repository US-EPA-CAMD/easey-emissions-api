import { Test } from '@nestjs/testing';
import { MonitorLocationChecksService } from "./monitor-location-checks.service";
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { HourlyOperatingImportDTO } from '../dto/hourly-operating.dto';
import { DailyTestSummaryImportDTO } from '../dto/daily-test-summary.dto';
import { WeeklyTestSummaryImportDTO } from '../dto/weekly-test-summary.dto';
import { SorbentTrapImportDTO } from '../dto/sorbent-trap.dto';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { Component } from '../entities/workspace/component.entity';
import { Unit } from '../entities/workspace/unit.entity';


describe('location checks service tests', () => {
    let service: MonitorLocationChecksService;
    let repository: any;

    const payload = new EmissionsImportDTO();
    payload.orisCode = 6;
    payload.hourlyOperatingData = [new HourlyOperatingImportDTO()]
    payload.hourlyOperatingData[0].stackPipeId = "sp1";
    payload.hourlyOperatingData[0].monitorHourlyValueData = [{parameterCode: "a", componentId:"1"}]
    payload.hourlyOperatingData[0].matsMonitorHourlyValueData = [{parameterCode: "a", componentId:"2"}]
    payload.hourlyOperatingData[0].hourlyGFMData = [{componentId: "3"}]

    payload.hourlyOperatingData = [new HourlyOperatingImportDTO()]
    payload.hourlyOperatingData[0].stackPipeId = "sp1";
    payload.hourlyOperatingData[0].monitorHourlyValueData = [{parameterCode: "a", componentId:"1"}]
    payload.hourlyOperatingData[0].matsMonitorHourlyValueData = [{parameterCode: "a", componentId:"3"}]
    payload.hourlyOperatingData[0].hourlyGFMData = [{componentId: "4"}]

    payload.sorbentTrapData = [new SorbentTrapImportDTO()];
    payload.sorbentTrapData[0].unitId="u2";
    payload.sorbentTrapData[0].samplingTrainData = [{componentId: "4", sorbentTrapSn: "123"}]


    payload.dailyTestSummaryData = [new DailyTestSummaryImportDTO()];
    payload.dailyTestSummaryData[0].componentId="5";
    payload.dailyTestSummaryData[0].unitId="u1";

    payload.weeklyTestSummaryData = [new WeeklyTestSummaryImportDTO()];
    payload.weeklyTestSummaryData[0].componentId="6";
    payload.dailyTestSummaryData[0].unitId="u1";

    const mockRepository = () => ({
      getLocationsByUnitStackPipeIds: jest.fn(),
    });
  
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        imports: [LoggerModule],
        providers: [
          MonitorLocationChecksService,
          {
            provide: MonitorLocationWorkspaceRepository,
            useFactory: mockRepository,
          },
        ],
      }).compile();
  
      service = module.get(MonitorLocationChecksService);
      repository = module.get(MonitorLocationWorkspaceRepository);
    });
    
    describe('location service processLocations() tests', () => {

      it('should produce the expected LocationIdentifiers array', ()=>{
        const locations: LocationIdentifiers[] = service.processLocations(payload)

        expect(locations.length).toEqual(2);
        expect(locations.filter(e=>e.unitId==="u1").length).toEqual(1);
        expect(locations.filter(e=>e.stackPipeId==="sp1").length).toEqual(1);
        
        // It's easier to equate when you convert set to array
        const u1ComponentIdList = Array.from(locations.find(e=>e.unitId==="u1").componentIds);
        expect(u1ComponentIdList.sort()).toEqual(['4', '5', '6'].sort());

        const sp1ComponentIdList = Array.from(locations.find(e=>e.stackPipeId==="sp1").componentIds);
        expect(sp1ComponentIdList.sort()).toEqual(['1', '3', '4'].sort());

      })
    })

    describe('location service runCheck() tests', ()=>{

      it( 'should return an empty errorList', async ()=>{

        repository.getLocationsByUnitStackPipeIds.mockResolvedValue([]);
        const [, errorList] = await service.runChecks(payload);
        expect(errorList.length).toEqual(0);
      })

      it('should return an errorList for componentId 6', async ()=>{
        const ml: MonitorLocation = new MonitorLocation();
        
        const c4 = new Component();
        c4.componentId = "4";
        const c5 = new Component();
        c5.componentId = "5";

        ml.components = [c4, c5]
        ml.unit = new Unit();
        ml.unit.name = "u1";

        repository.getLocationsByUnitStackPipeIds.mockResolvedValue([ml]);

        const [, errorList] = await service.runChecks(payload);
        expect(errorList.length).toEqual(1);
      })
    })

});