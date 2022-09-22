import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { MonitorHrlyValue } from '../entities/monitor-hrly-value.entity';
import { MonitorHrlyValue as MonitorHrlyValueWorkspace } from '../entities/workspace/monitor-hrly-value.entity';
import { MonitorHourlyValueDTO } from '../dto/monitor-hourly-value.dto';

@Injectable()
export class MonitorHourlyValueMap extends BaseMap<
  MonitorHrlyValue | MonitorHrlyValueWorkspace,
  MonitorHourlyValueDTO
> {
  public async one(
    entity: MonitorHrlyValue | MonitorHrlyValueWorkspace,
  ): Promise<MonitorHourlyValueDTO> {
    const componentId = entity.component ? entity.component.componentId : null;
    const monitoringSystemId = entity.monitorSystem
      ? entity.monitorSystem.monitoringSystemId
      : null;

    return {
      id: entity.id,
      hourId: entity.hourId,
      monitoringLocationId: entity.monitoringLocationId,
      parameterCode: entity.parameterCode,
      unadjustedHourlyValue: entity.unadjustedHourlyValue,
      adjustedHourlyValue: entity.adjustedHourlyValue,
      modcCode: entity.modcCode,
      monitoringSystemId: monitoringSystemId,
      monitoringSystemRecordId: entity.monitoringSystemId,
      componentId: componentId,
      componentRecordId: entity.componentId,
      percentAvailable: entity.percentAvailable,
      moistureBasis: entity.moistureBasis,
      biasAdjustmentFactor: entity.biasAdjustmentFactor,
      calcAdjustedHrlyValue: entity.calcAdjustedHrlyValue,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      calcLineStatus: entity.calcLineStatus,
      calcRataStatus: entity.calcRataStatus,
      calcDaycalStatus: entity.calcDaycalStatus,
      reportingPeriodId: entity.reportingPeriodId,
      calcLeakStatus: entity.calcLeakStatus,
      calcDayintStatus: entity.calcDayintStatus,
      calcF2lStatus: entity.calcF2lStatus,
    };
  }
}
