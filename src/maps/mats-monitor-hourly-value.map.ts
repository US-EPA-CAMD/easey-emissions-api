import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MatsMonitorHourlyValueDTO } from '../dto/mats-monitor-hourly-value.dto';
import { MatsMonitorHrlyValue } from '../entities/mats-monitor-hrly-value.entity';

@Injectable()
export class MatsMonitorHourlyValueMap extends BaseMap<
  MatsMonitorHrlyValue,
  MatsMonitorHourlyValueDTO
> {
  public async one(
    entity: MatsMonitorHrlyValue,
  ): Promise<MatsMonitorHourlyValueDTO> {
    const componentId = entity.component ? entity.component.componentId : null;
    const monitoringSystemId = entity.monitorSystem
      ? entity.monitorSystem.monitoringSystemId
      : null;

    return {
      id: entity.id,
      hourId: entity.hourId,
      monitoringLocationId: entity.monitoringLocationId,
      reportingPeriodId: entity.reportingPeriodId,
      monitoringSystemId: monitoringSystemId,
      monitoringSystemRecordId: entity.monitoringSystemId,
      componentId: componentId,
      componentRecordId: entity.componentId,
      parameterCode: entity.parameterCode,
      unadjustedHourlyValue: entity.unadjustedHourlyValue,
      modcCode: entity.modcCode,
      percentAvailable: entity.percentAvailable,
      calcUnadjustedHrlyValue: entity.calcUnadjustedHrlyValue,
      calcDailyCalStatus: entity.calcDailyCalStatus,
      calcHgLineStatus: entity.calcHgLineStatus,
      calcHgi1Status: entity.calcHgi1Status,
      calcRataStatus: entity.calcRataStatus,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
    };
  }
}
