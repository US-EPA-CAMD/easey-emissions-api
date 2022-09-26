import { Test } from '@nestjs/testing';
import { HourlyParameterFuelFlowWorkspaceRepository } from './hourly-parameter-fuel-flow-workspace.repository';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyParameterFuelFlowWorkspaceService } from './hourly-parameter-fuel-flow-workspace.service';
import { genHourlyParamFuelFlow } from '../../test/object-generators/hourly-param-fuel-flow';
import { HrlyParamFuelFlow } from '../entities/workspace/hrly-param-fuel-flow.entity';
import { HourlyFuelFlowWorkspaceService } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.service';
import { HourlyFuelFlowWorkspaceRepository } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.repository';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { genHourlyParamFuelFlowImportDto } from '../../test/object-generators/hourly-param-fuel-flow-dto';

describe('HourlyParameterFuelFlowWoskpaceService', () => {
  let service: HourlyParameterFuelFlowWorkspaceService;
  let repository: HourlyParameterFuelFlowWorkspaceRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HourlyParameterFuelFlowWorkspaceService,
        HourlyParameterFuelFlowWorkspaceRepository,
        HourlyParameterFuelFlowMap,
        HourlyFuelFlowWorkspaceService,
        HourlyFuelFlowWorkspaceRepository,
        HourlyFuelFlowMap,
      ],
    }).compile();

    service = module.get(HourlyParameterFuelFlowWorkspaceService);
    repository = module.get(HourlyParameterFuelFlowWorkspaceRepository);
  });

  describe('export', () => {
    it('should return the correct shape of data given correct inputs', async function() {
      const hourlyParams = genHourlyParamFuelFlow<HrlyParamFuelFlow>(3);

      jest.spyOn(repository, 'export').mockResolvedValue(hourlyParams);

      await expect(service.export('123')).resolves.toEqual(
        hourlyParams.map(param => {
          return {
            id: param.id,
            userId: param.userId,
            monitoringLocationId: param.monitoringLocationId,
            parameterCode: param.parameterCode,
            parameterValueForFuel: param.parameterValueForFuel,
            formulaIdentifier: param.monitorFormula?.formulaId ?? null,
            monitoringFormulaRecordId: param.formulaIdentifier,
            sampleTypeCode: param.sampleTypeCode,
            monitoringSystemId: param.monitorSystem?.monitoringSystemId ?? null,
            operatingConditionCode: param.operatingConditionCode,
            segmentNumber: param.segmentNumber,
            parameterUomCode: param.parameterUomCode,
            hourlyFuelFlowId: param.hourlyFuelFlowId,
            calcParamValFuel: param.calcParamValFuel,
            addDate: param.addDate,
            updateDate: param.updateDate,
            calcAppeStatus: param.calcAppeStatus,
            reportingPeriodId: param.reportingPeriodId,
          };
        }),
      );
    });
  });

  describe('import', () => {
    it('should import a record', async () => {
      const paramFuelFlowImport = genHourlyParamFuelFlowImportDto()[0];

      jest.spyOn(service, 'import').mockResolvedValue(undefined);

      await expect(
        service.import(paramFuelFlowImport, '12345', '123', 123, {
          components: {},
          monitoringSystems: {},
          monitorFormulas: {},
        }),
      ).resolves;
    });
  });
});
