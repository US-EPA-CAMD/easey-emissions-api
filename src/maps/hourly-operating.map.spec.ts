import { HourlyOperatingMap } from './hourly-operating.map';
import { HrlyOpData } from '../entities/hrly-op-data.entity';
import { genHourlyOpValues } from '../../test/object-generators/hourly-op-data-values';

describe('HourlyOperatingMap', () => {
  let map: HourlyOperatingMap;

  beforeAll(() => {
    map = new HourlyOperatingMap();
  });

  it('should map values correctly', async function() {
    const mocks = genHourlyOpValues<HrlyOpData>(3);

    const expectOne = async (mock: HrlyOpData) => {
      await expect(map.one(mock)).resolves.toEqual({
        id: mock.id,
        monitoringLocationId: mock.monitoringLocationId,
        stackPipeId: mock.monitorLocation?.stackPipe
          ? mock.monitorLocation.stackPipe.name
          : null,
        unitId: mock.monitorLocation?.unit
          ? mock.monitorLocation.unit.name
          : null,
        reportingPeriodId: mock.reportingPeriodId,
        date: mock.date,
        hour: mock.hour,
        operatingTime: mock.operatingTime,
        hourLoad: mock.hourLoad,
        loadUnitsOfMeasureCode: mock.loadUnitsOfMeasureCode,
        matsHourLoad: mock.matsHourLoad,
        loadRange: mock.loadRange,
        commonStackLoadRange: mock.commonStackLoadRange,
        fcFactor: mock.fcFactor,
        fdFactor: mock.fdFactor,
        fwFactor: mock.fwFactor,
        fuelCode: mock.fuelCode,
        matsStartupShutdownFlag: mock.matsStartupShutdownFlag,
        multiFuelFlg: mock.multiFuelFlg,
        fuelCdList: mock.fuelCdList,
        mhhiIndicator: mock.mhhiIndicator,
        operatingConditionCode: mock.operatingConditionCode,
        userId: mock.userId,
        addDate: mock.addDate,
        updateDate: mock.updateDate,
        monitorHourlyValueData: mock.monitorHourlyValues ?? [],
        matsMonitorHourlyValueData: mock.matsMonitorHourlyValues ?? [],
        derivedHourlyValueData: mock.derivedHrlyValues ?? [],
        matsDerivedHourlyValueData: mock.matsDerivedHourlyValues ?? [],
        hourlyFuelFlowData: mock.hrlyFuelFlows ?? [],
        hourlyGFMData: mock.hrlyGasFlowMeters ?? [],
      });
    };

    await Promise.all(
      mocks.map(mock => {
        return expectOne(mock);
      }),
    );
  });
});
