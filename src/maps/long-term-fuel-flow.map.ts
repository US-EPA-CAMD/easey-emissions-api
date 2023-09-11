import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { LongTermFuelFlow } from '../entities/long-term-fuel-flow.entity';
import { LongTermFuelFlow as LongTermFuelFlowWorkspace } from '../entities/workspace/long-term-fuel-flow.entity';
import { LongTermFuelFlowDTO } from '../dto/long-term-fuel-flow.dto';

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
    const monitoringSystemId =
      entity?.monitorSystem?.monitoringSystemId ?? null;

    return {
      stackPipeId,
      unitId,
      monitoringSystemId,
      id: entity.id,
      reportingPeriodId: entity.reportingPeriodId,
      monitoringLocationId: entity.monitoringLocationId,
      monitoringSystemRecordId: entity.monitoringSystemId,
      calcTotalHeatInput: entity.calcTotalHeatInput,
      fuelFlowPeriodCode: entity.fuelFlowPeriodCode,
      longTermFuelFlowValue: entity.longTermFuelFlowValue,
      longTermFuelFlowUnitsOfMeasureCode: entity.longTermFuelFlowUomCode,
      grossCalorificValue: entity.grossCalorificValue,
      gcvUnitsOfMeasureCode: entity.gcvUnitsOfMeasureCode,
      totalHeatInput: entity.totalHeatInput,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
    };
  }
}
