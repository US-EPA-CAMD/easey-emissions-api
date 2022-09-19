import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { HourlyFuelFlowDTO } from '../dto/hourly-fuel-flow.dto';
import { HrlyFuelFlow } from '../entities/hrly-fuel-flow.entity';
import { HrlyFuelFlow as HrlyFuelFlowWorkspace } from '../entities/workspace/hrly-fuel-flow.entity';

@Injectable()
export class HourlyFuelFlowMap extends BaseMap<
  HrlyFuelFlow | HrlyFuelFlowWorkspace,
  HourlyFuelFlowDTO
> {
  public async one(
    entity: HrlyFuelFlow | HrlyFuelFlowWorkspace,
  ): Promise<HourlyFuelFlowDTO> {
    return {
      fuelCode: entity.fuelCode,
      fuelUsageTime: entity.fuelUsageTime,
      volumetricFlowRate: entity.volumetricFlowRate,
      volumetricUnitsOfMeasureCode: entity.volumetricUnitsOfMeasureCode,
      sourceOfDataVolumetricCode: entity.sourceOfDataVolumetricCode,
      massFlowRate: entity.massFlowRate,
      sourceOfDataMassCode: entity.sourceOfDataMassCode,
      monitoringSystemId: entity.monitorSystem.monitoringSystemId,
      id: entity.id,
      hourId: entity.hourId,
      monitoringSystemRecordId: entity.monitorSystem.id,
      calcMassFlowRate: entity.calcMassFlowRate,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      calcVolumetricFlowRate: entity.calcVolumetricFlowRate,
      calcAppdStatus: entity.calcAppdStatus,
      reportingPeriodId: entity.reportingPeriodId,
      monitoringLocationId: entity.monitoringLocationId,
      hourlyParameterFuelFlowData: null,
    };
  }
}
