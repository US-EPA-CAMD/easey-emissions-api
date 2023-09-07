import { HourlyGasFlowMeterMap } from './hourly-gas-flow-meter.map';
import { genHourlyGasFlowMeter } from '../../test/object-generators/hourly-gas-flow-meter';
import { HrlyGasFlowMeter } from '../entities/hrly-gas-flow-meter.entity';

describe('HourlyGasFlowMap', () => {
  let map: HourlyGasFlowMeterMap;

  beforeAll(() => {
    map = new HourlyGasFlowMeterMap();
  });

  it('should map values correctly', async function() {
    const mocks = genHourlyGasFlowMeter<HrlyGasFlowMeter>(3);

    const expectOne = async (mock: HrlyGasFlowMeter) => {
      await expect(map.one(mock)).resolves.toEqual({
        id: mock.id,
        hourId: mock.hourId,
        componentId: mock.component ? mock.component.componentId : null,
        componentRecordId: mock.componentId,
        monitoringLocationId: mock.monitoringLocationId,
        reportingPeriodId: mock.reportingPeriodId,
        beginEndHourFlag: mock.beginEndHourFlag,
        hourlyGFMReading: mock.hourlyGfmReading,
        averageHourlySamplingRate: mock.avgHourlySamplingRate,
        samplingRateUnitsOfMeasureCode: mock.samplingRateUom,
        hourlySFSRRatio: mock.hourlySfsrRatio,
        calcFlowToSamplingRatio: mock.calcFlowToSamplingRatio,
        calcFlowToSamplingMult: mock.calcFlowToSamplingMult,
        userId: mock.userId,
        addDate: mock.addDate?.toISOString() ?? null,
        updateDate: mock.updateDate?.toISOString() ?? null,
      });
    };

    await Promise.all(
      mocks.map(mock => {
        return expectOne(mock);
      }),
    );
  });
});
