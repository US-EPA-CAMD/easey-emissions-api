import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { WeeklyTestSummary as WeeklyTestSummaryWorkspace } from '../entities/workspace/weekly-test-summary.entity';
import { WeeklyTestSummary } from '../entities/weekly-test-summary.entity';
import { WeeklyTestSummaryDTO } from '../dto/weekly-test-summary.dto';

@Injectable()
export class WeeklyTestSummaryMap extends BaseMap<
  WeeklyTestSummary | WeeklyTestSummaryWorkspace,
  WeeklyTestSummaryDTO
> {
  public async one(
    entity: WeeklyTestSummary | WeeklyTestSummaryWorkspace,
  ): Promise<WeeklyTestSummaryDTO> {
    const unitId = entity?.monitorLocation?.unit?.name ?? null;
    const stackPipeId = entity?.monitorLocation?.stackPipe?.name ?? null;
    const componentId = entity?.component?.componentId ?? null;

    return {
      id: entity.id,
      reportingPeriodId: entity.reportingPeriodId,
      monitoringLocationId: entity.monitoringLocationId,
      stackPipeId,
      unitId,
      date: entity.date,
      hour: entity.hour,
      minute: entity.minute,
      componentId: componentId,
      componentRecordId: entity.componentId,
      testTypeCode: entity.testTypeCode,
      testResultCode: entity.testResultCode,
      spanScaleCode: entity.spanScaleCode,
      monitoringSystemRecordId: entity.monitoringSystemId,
      calcTestResultCode: entity.calcTestResultCode,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      weeklySystemIntegrityData: [],
    };
  }
}
