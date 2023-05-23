import { genSummaryValue } from '../../test/object-generators/summary-value';
import { SummaryValue } from '../entities/summary-value.entity';
import { SummaryValue as SummaryValueWorkspace } from '../entities/workspace/summary-value.entity';

import { SummaryValueMap } from './summary-value.map';

describe('Summary Value Map Test', () => {
  let map: SummaryValueMap;

  beforeAll(() => {
    map = new SummaryValueMap();
  });

  it('should map values correctly', async function() {
    const mocks = [
      genSummaryValue<SummaryValue>(1)[0],
      //   genSummaryValue<SummaryValueWorkspace>(1)[0]
    ];

    const expectOne = async (mock: SummaryValue | SummaryValueWorkspace) => {
      await expect(map.one(mock)).resolves.toEqual({
        id: mock.id,
        reportingPeriodId: mock.reportingPeriodId,
        monitoringLocationId: mock.monitoringLocationId,
        calcCurrentRptPeriodTotal: mock.calcCurrentRptPeriodTotal,
        calcOsTotal: mock.calcOsTotal,
        calcYearTotal: mock.calcYearTotal,
        userId: mock.userId,
        addDate: mock.addDate?.toISOString() ?? null,
        updateDate: mock.updateDate?.toISOString() ?? null,
        stackPipeId: mock.monitorLocation?.stackPipe?.name ?? null,
        unitId: mock.monitorLocation?.unit?.name ?? null,
        parameterCode: mock.parameterCode,
        currentReportingPeriodTotal: mock.currentReportingPeriodTotal,
        ozoneSeasonToDateTotal: mock.ozoneSeasonToDateTotal,
        yearToDateTotal: mock.yearToDateTotal,
      });
    };

    await Promise.all(
      mocks.map(mock => {
        return expectOne((mock as unknown) as SummaryValue);
      }),
    );
  });
});
