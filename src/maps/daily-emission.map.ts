import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { DailyEmissionDTO } from '../dto/daily-emission.dto';
import { DailyEmission } from '../entities/daily-emission.entity';
import { DailyEmission as DailyEmissionWorkspace } from '../entities/workspace/daily-emission.entity';

@Injectable()
export class DailyEmissionMap extends BaseMap<
  DailyEmission | DailyEmissionWorkspace,
  DailyEmissionDTO
> {
  public async one(
    entity: DailyEmission | DailyEmissionWorkspace,
  ): Promise<DailyEmissionDTO> {
    const unitId = entity.monitorLocation?.unit?.name ?? null;

    const stackPipeId = entity.monitorLocation?.stackPipe?.name ?? null;

    return {
      id: entity.id,
      reportingPeriodId: entity.reportingPeriodId,
      monitoringLocationId: entity.monitoringLocationId,
      stackPipeId,
      unitId,
      parameterCode: entity.parameterCode,
      date: entity.date,
      totalDailyEmissions: entity.totalDailyEmissions,
      adjustedDailyEmissions: entity.adjustedDailyEmissions,
      sorbentRelatedMassEmissions: entity.sorbentRelatedMassEmissions,
      unadjustedDailyEmissions: entity.unadjustedDailyEmissions,
      totalCarbonBurned: entity.totalCarbonBurned,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
      calcTotalDailyEmissions: entity.calcTotalDailyEmissions,
      calcTotalOpTime: entity.calcTotalOpTime,
      dailyFuelData: [],
    };
  }
}
