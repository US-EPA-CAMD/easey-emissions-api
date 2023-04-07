import { Injectable } from '@nestjs/common';
import { LongTermFuelFlow } from '../entities/long-term-fuel-flow.entity';
import { LongTermFuelFlow as LongTermFuelFlowWorkspace } from '../entities/workspace/long-term-fuel-flow.entity';
import { LongTermFuelFlowDTO } from '../dto/long-term-fuel-flow.dto';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
@Injectable()
export class LongTermFuelFlowMap extends BaseMap<
  LongTermFuelFlow | LongTermFuelFlowWorkspace,
  LongTermFuelFlowDTO
> {
  public async one(
    entity: LongTermFuelFlow | LongTermFuelFlowWorkspace,
  ): Promise<LongTermFuelFlowDTO> {
    const unitId = entity?.monitorLocation?.unit?.name ?? null;
    const stackPipeId = entity?.monitorLocation?.stackPipe?.name ?? null;
    const monitoringSystemId = entity.monitorSystem?.monitoringSystemId ?? null;

    return {
      id: entity.id,
      unitId: unitId,
      stackPipeId: stackPipeId,
      monitoringSystemId: monitoringSystemId,
      reportingPeriodId: entity.reportingPeriodId,
      monitoringLocationId: entity.monitoringLocationId,
      fuelFlowPeriodCode: entity.fuelFlowPeriodCode,
      longTermFuelFlowValue: entity.longTermFuelFlowValue,
      longTermFuelFlowUomCode: entity.longTermFuelFlowUomCode,
      grossCalorificValue: entity.grossCalorificValue,
      gcvUnitsOfMeasureCode: entity.gcvUnitsOfMeasureCode,
      totalHeatInput: entity.totalHeatInput,
      monitoringSystemRecordId: entity.monitoringSystemId,
      calcTotalHeatInput: entity.calcTotalHeatInput,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
    };
  }
}
