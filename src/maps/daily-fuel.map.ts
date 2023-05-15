import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { DailyFuel } from '../entities/daily-fuel.entity';
import { DailyFuel as DailyFuelWorkspace } from '../entities/workspace/daily-fuel.entity';
import { DailyFuelDTO } from '../dto/daily-fuel.dto';

@Injectable()
export class DailyFuelMap extends BaseMap<
  DailyFuel | DailyFuelWorkspace,
  DailyFuelDTO
> {
  public async one(
    entity: DailyFuel | DailyFuelWorkspace,
  ): Promise<DailyFuelDTO> {
    return {
      fuelCode: entity.fuelCode,
      dailyFuelFeed: entity.dailyFuelFeed,
      carbonContentUsed: entity.carbonContentUsed,
      fuelCarbonBurned: entity.fuelCarbonBurned,
      id: entity.id,
      dailyEmissionId: entity.dailyEmissionId,
      calcFuelCarbonBurned: entity.calcFuelCarbonBurned,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
      reportingPeriodId: entity.reportingPeriodId,
      monitoringLocationId: entity.monitoringLocationId,
    };
  }
}
