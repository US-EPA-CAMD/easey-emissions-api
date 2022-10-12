import { HourlyFuelFlowMap } from './hourly-fuel-flow-map';
import { genHourlyFuelFlow } from '../../test/object-generators/hourly-fuel-flow';
import { HrlyFuelFlow } from '../entities/hrly-fuel-flow.entity';

describe('HourlyFuelFlowMap', () => {
  let map: HourlyFuelFlowMap;

  beforeAll(() => {
    map = new HourlyFuelFlowMap();
  });

  it('should map values correctly', async function() {
    const mocks = genHourlyFuelFlow(3);

    const expectOne = async (mock: HrlyFuelFlow) => {
      await expect(map.one(mock)).resolves.toEqual({
        fuelCode: mock.fuelCode,
        fuelUsageTime: mock.fuelUsageTime,
        volumetricFlowRate: mock.volumetricFlowRate,
        volumetricUnitsOfMeasureCode: mock.volumetricUnitsOfMeasureCode,
        sourceOfDataVolumetricCode: mock.sourceOfDataVolumetricCode,
        massFlowRate: mock.massFlowRate,
        sourceOfDataMassCode: mock.sourceOfDataMassCode,
        monitoringSystemId: mock.monitorSystem?.monitoringSystemId ?? null,
        id: mock.id,
        hourId: mock.hourId,
        monitoringSystemRecordId: mock.monitoringSystemId,
        calcMassFlowRate: mock.calcMassFlowRate,
        userId: mock.userId,
        addDate: mock.addDate,
        updateDate: mock.updateDate,
        calcVolumetricFlowRate: mock.calcVolumetricFlowRate,
        calcAppdStatus: mock.calcAppdStatus,
        reportingPeriodId: mock.reportingPeriodId,
        monitoringLocationId: mock.monitoringLocationId,
        hourlyParameterFuelFlowData: mock.hrlyParamFuelFlows ?? null,
      });
    };

    await Promise.all(
      mocks.map(mock => {
        return expectOne((mock as unknown) as HrlyFuelFlow);
      }),
    );
  });
});
