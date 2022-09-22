import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { HrlyOpData } from '../entities/hrly-op-data.entity';
import { HrlyOpData as HrlyOpDataWorkspace } from '../entities/workspace/hrly-op-data.entity';

import { HourlyOperatingDTO } from '../dto/hourly-operating.dto';

@Injectable()
export class HourlyOperatingMap extends BaseMap<
  HrlyOpData | HrlyOpDataWorkspace,
  HourlyOperatingDTO
> {
  public async one(
    entity: HrlyOpData | HrlyOpDataWorkspace,
  ): Promise<HourlyOperatingDTO> {
    const unitId = entity.monitorLocation?.unit
      ? entity.monitorLocation.unit.name
      : null;

    const stackPipeId = entity.monitorLocation?.stackPipe
      ? entity.monitorLocation.stackPipe.name
      : null;

    return {
      id: entity.id,
      monitoringLocationId: entity.monitoringLocationId,
      stackPipeId: stackPipeId,
      unitId: unitId,
      reportingPeriodId: entity.reportingPeriodId,
      date: entity.date,
      hour: entity.hour,
      operatingTime: entity.operatingTime,
      hourLoad: entity.hourLoad,
      loadUnitsOfMeasureCode: entity.loadUnitsOfMeasureCode,
      matsHourLoad: entity.matsHourLoad,
      loadRange: entity.loadRange,
      commonStackLoadRange: entity.commonStackLoadRange,
      fcFactor: entity.fcFactor,
      fdFactor: entity.fdFactor,
      fwFactor: entity.fwFactor,
      fuelCode: entity.fuelCode,
      matsStartupShutdownFlag: entity.matsStartupShutdownFlag,
      multiFuelFlg: entity.multiFuelFlg,
      fuelCdList: entity.fuelCdList,
      mhhiIndicator: entity.mhhiIndicator,
      operatingConditionCode: entity.operatingConditionCode,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      monitorHourlyValueData: null,
      matsMonitorHourlyValueData: null,
      derivedHourlyValueData: null,
      matsDerivedHourlyValueData: null,
      hourlyFuelFlowData: null,
      hourlyGFMData: null,
    };
  }
}
