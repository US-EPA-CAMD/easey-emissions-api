import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { DailyCalibrationMap } from './daily-calibration.map';
import { DailyTestSummaryDTO } from '../dto/daily-test-summary.dto';
import { DailyTestSummary } from '../entities/daily-test-summary.entity';

@Injectable()
export class DailyTestSummaryMap extends BaseMap<DailyTestSummary, DailyTestSummaryDTO> {

  constructor(
    private readonly dailyCalibrationMap: DailyCalibrationMap
  ) {
    super();
  }

  public async one(entity: DailyTestSummary): Promise<DailyTestSummaryDTO> {

    //console.log(entity);

    const unitId = entity.monitorLocation.unit
      ? entity.monitorLocation.unit.name
      : null;

    const stackPipeId = entity.monitorLocation.stackPipe
      ? entity.monitorLocation.stackPipe.name
      : null;

    const componentId = entity.component
      ? entity.component.componentID
      : null;

    const monitoringSystemId = entity.monitorSystem
      ? entity.monitorSystem.monitoringSystemId
      : null;
    
    const dailyCalibrationData = entity.dailyCalibrations
      ? await this.dailyCalibrationMap.many(entity.dailyCalibrations)
      : null;

    return {
      id: entity.id,
      monitoringLocationId: entity.monitoringLocationId,
      stackPipeId,
      unitId,
      reportingPeriodId: entity.reportingPeriodId,
      date: entity.date,
      hour: entity.hour,
      minute: entity.minute,
      monitoringSystemId,
      componentId,
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
