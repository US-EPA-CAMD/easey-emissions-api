import { Test } from '@nestjs/testing';
import { HourlyParameterFuelFlowRepository } from './hourly-parameter-fuel-flow.repository';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyParameterFuelFlowService } from './hourly-parameter-fuel-flow.service';
import { genHourlyParamFuelFlow } from '../../test/object-generators/hourly-param-fuel-flow';
import { HrlyParamFuelFlow } from '../entities/hrly-param-fuel-flow.entity';

describe('HourlyParameterFuelFlowWoskpaceService', () => {
  let service: HourlyParameterFuelFlowService;
  let repository: HourlyParameterFuelFlowRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HourlyParameterFuelFlowService,
        HourlyParameterFuelFlowRepository,
        HourlyParameterFuelFlowMap,
      ],
    }).compile();

    service = module.get(HourlyParameterFuelFlowService);
    repository = module.get(HourlyParameterFuelFlowRepository);
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
            addDate: param.addDate ? param.addDate.toISOString() : null,
            updateDate: param.updateDate
              ? param.updateDate.toISOString()
              : null,
            calcAppeStatus: param.calcAppeStatus,
            reportingPeriodId: param.reportingPeriodId,
          };
        }),
      );
    });
  });
});
