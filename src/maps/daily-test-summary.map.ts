import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { DailyTestSummaryDTO } from '../dto/daily-test-summary.dto';
import { DailyTestSummary } from '../entities/daily-test-summary.entity';
import { DailyTestSummary as DailyTestSummaryWorkspace } from '../entities/workspace/daily-test-summary.entity';
import { DailyCalibrationMap } from './daily-calibration.map';

@Injectable()
export class DailyTestSummaryMap extends BaseMap<
  DailyTestSummary | DailyTestSummaryWorkspace,
  DailyTestSummaryDTO
> {
  public async one(
    entity: DailyTestSummary | DailyTestSummaryWorkspace,
  ): Promise<DailyTestSummaryDTO> {
    const unitId = entity.monitorLocation?.unit
      ? entity?.monitorLocation?.unit?.name
      : null;

    const stackPipeId = entity.monitorLocation?.stackPipe
      ? entity?.monitorLocation?.stackPipe?.name
      : null;

    const componentId = entity.component?.componentId ?? null;

    const monitoringSystemId = entity.monitorSystem?.monitoringSystemId ?? null;

    let dailyCalibrationData = null;
    if (Array.isArray(entity.dailyCalibrations)) {
      dailyCalibrationData = await new DailyCalibrationMap().many(
        entity.dailyCalibrations,
      );
    }

    return {
      id: entity.id,
      monitoringLocationId: entity.monitoringLocationId,
      stackPipeId: stackPipeId,
      unitId: unitId,
      reportingPeriodId: entity.reportingPeriodId,
      date: entity.date,
      hour: entity.hour,
      minute: entity.minute,
      monitoringSystemId: monitoringSystemId,
      monitoringSystemRecordId: entity.monitoringSystemId,
      componentId: componentId,
      componentRecordId: entity.componentId,
      testTypeCode: entity.testTypeCode,
      testResultCode: entity.testResultCode,
      calcTestResultCode: entity.calcTestResultCode,
      spanScaleCode: entity.spanScaleCode,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      dailyCalibrationData,
    };
  }
}
