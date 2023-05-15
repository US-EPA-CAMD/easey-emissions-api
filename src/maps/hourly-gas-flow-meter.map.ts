import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { HrlyGasFlowMeter } from '../entities/hrly-gas-flow-meter.entity';
import { HrlyGasFlowMeter as HrlyGasFlowMeterWorkspace } from '../entities/workspace/hrly-gas-flow-meter.entity';
import { HourlyGasFlowMeterDTO } from '../dto/hourly-gas-flow-meter.dto';

@Injectable()
export class HourlyGasFlowMeterMap extends BaseMap<
  HrlyGasFlowMeter | HrlyGasFlowMeterWorkspace,
  HourlyGasFlowMeterDTO
> {
  public async one(
    entity: HrlyGasFlowMeter | HrlyGasFlowMeterWorkspace,
  ): Promise<HourlyGasFlowMeterDTO> {
    const componentId = entity.component ? entity.component.componentId : null;

    return {
      id: entity.id,
      hourId: entity.hourId,
      componentId: componentId,
      componentRecordId: entity.componentId,
      monitoringLocationId: entity.monitoringLocationId,
      reportingPeriodId: entity.reportingPeriodId,
      beginEndHourFlag: entity.beginEndHourFlag,
      hourlyGfmReading: entity.hourlyGfmReading,
      avgHourlySamplingRate: entity.avgHourlySamplingRate,
      samplingRateUom: entity.samplingRateUom,
      hourlySfsrRatio: entity.hourlySfsrRatio,
      calcFlowToSamplingRatio: entity.calcFlowToSamplingRatio,
      calcFlowToSamplingMult: entity.calcFlowToSamplingMult,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
    };
  }
}
