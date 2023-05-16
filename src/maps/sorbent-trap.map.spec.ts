import { SorbentTrapMap } from './sorbent-trap.map';
import { genSorbentTrap } from '../../test/object-generators/sorbent-trap';
import { SorbentTrap } from '../entities/sorbent-trap.entity';

describe('SorbentTrapMap', () => {
  let map: SorbentTrapMap;

  beforeAll(() => {
    map = new SorbentTrapMap();
  });

  it('should map values correctly', async function() {
    const mocks = [
      genSorbentTrap<SorbentTrap>()[0],
      genSorbentTrap<SorbentTrap>(1, {
        include: ['reportingPeriod'],
      })[0],
      genSorbentTrap<SorbentTrap>(1, {
        include: ['monitorLocation'],
      })[0],
      genSorbentTrap<SorbentTrap>(1, {
        include: ['monitorSystem'],
      })[0],
      genSorbentTrap<SorbentTrap>(1, {
        include: ['samplingTrains'],
      })[0],
      genSorbentTrap<SorbentTrap>(1, {
        include: [
          'reportingPeriod',
          'monitorLocation',
          'monitorSystem',
          'samplingTrains',
        ],
      })[0],
    ];

    const expectOne = async (mock: SorbentTrap) => {
      await expect(map.one(mock)).resolves.toEqual({
        id: mock.id,
        unitId: mock.monitorLocation?.unit?.name ?? null,
        stackPipeId: mock.monitorLocation?.stackPipe?.name ?? null,
        monitoringLocationId: mock.monitorLocation?.id ?? null,
        reportingPeriodId: mock.reportingPeriodId,
        monitoringSystemRecordId: mock.monitoringSystemId,
        beginDate: mock.beginDate,
        beginHour: mock.beginHour,
        endDate: mock.endDate,
        endHour: mock.endHour,
        monitoringSystemId: mock.monitorSystem?.monitoringSystemId ?? null,
        pairedTrapAgreement: mock.pairedTrapAgreement,
        absoluteDifferenceIndicator: mock.absoluteDifferenceIndicator,
        modcCode: mock.modcCode,
        hgSystemConcentration: mock.hgSystemConcentration,
        apsCode: mock.apsCode,
        rataIndicator: mock.rataIndicator,
        calcPairedTrapAgreement: mock.calcPairedTrapAgreement,
        calcModcCode: mock.calcModcCode,
        calcHgConcentration: mock.calcHgConcentration,
        userId: mock.userId,
        addDate: mock.addDate?.toISOString() ?? null,
        updateDate: mock.updateDate?.toISOString() ?? null,
        samplingTrainData: [],
      });
    };

    await Promise.all(
      mocks.map(mock => {
        return expectOne(mock);
      }),
    );
  });
});
