import { HourlyParameterFuelFlowMap } from './hourly-parameter-fuel-flow.map';
import { genHourlyParamFuelFlow } from '../../test/object-generators/hourly-param-fuel-flow';
import { HrlyParamFuelFlow } from '../entities/hrly-param-fuel-flow.entity';

describe('HourlyParameterFuelFlowMap', () => {
  let map: HourlyParameterFuelFlowMap;

  beforeAll(() => {
    map = new HourlyParameterFuelFlowMap();
  });

  it('should map values correctly', async function() {
    const params = genHourlyParamFuelFlow<HrlyParamFuelFlow>(3);

    await expect(map.many(params)).resolves.toEqual(
      params.map(param => {
        return {
          id: param.id,
          userId: param.userId,
          monitoringLocationId: param.monitoringLocationId,
          parameterCode: param.parameterCode,
          parameterValueForFuel: param.parameterValueForFuel,
          formulaIdentifier: param.formulaIdentifier,
          sampleTypeCode: param.sampleTypeCode,
          monitoringSystemId: param.monitoringSystemId,
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
