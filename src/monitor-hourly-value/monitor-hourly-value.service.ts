import { Injectable } from '@nestjs/common';

import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { MonitorHourlyValueRepository } from './monitor-hourly-value.repository';
import { MonitorHourlyValueDTO } from '../dto/monitor-hourly-value.dto';

@Injectable()
export class MonitorHourlyValueService {

  constructor(
    private readonly map: MonitorHourlyValueMap,
    private readonly repository: MonitorHourlyValueRepository,
  ) {}

  async export(hourIds: string[]): Promise<MonitorHourlyValueDTO[]> {
    const results = await this.repository.export(hourIds);
    return this.map.many(results);
  }

  async removeNonReportedValues(monitorHourlyValueData: MonitorHourlyValueDTO[]) {
    monitorHourlyValueData.forEach(dto => {
      delete dto.id;
      delete dto.hourId;
      delete dto.reportingPeriodId;
      delete dto.monitoringLocationId;
      delete dto.monitoringSystemRecordId;
      delete dto.componentRecordId;
      delete dto.biasAdjustmentFactor;
      delete dto.calcAdjustedHrlyValue;
      delete dto.calcLineStatus;
      delete dto.calcRataStatus;
      delete dto.calcDaycalStatus;
      delete dto.calcLeakStatus;
      delete dto.calcDayintStatus;
      delete dto.calcF2lStatus;
      delete dto.userId;
      delete dto.addDate;
      delete dto.updateDate;
    })
  }
}
