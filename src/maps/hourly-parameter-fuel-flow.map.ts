import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { HrlyParamFuelFlow } from '../entities/hrly-param-fuel-flow.entity';
import { HrlyParamFuelFlow as HrlyParamFuelFlowWorkspace } from '../entities/workspace/hrly-param-fuel-flow.entity';
import { HourlyParamFuelFlowDTO } from '../dto/hourly-param-fuel-flow.dto';

@Injectable()
export class HourlyParameterFuelFlowMap extends BaseMap<
  HrlyParamFuelFlow | HrlyParamFuelFlowWorkspace,
  HourlyParamFuelFlowDTO
> {
  public async one(
    entity: HrlyParamFuelFlow | HrlyParamFuelFlowWorkspace,
  ): Promise<HourlyParamFuelFlowDTO> {
    const monitoringSystemId = entity.monitorSystem?.monitoringSystemId ?? null;
    const formulaId = entity.monitorFormula?.formulaId ?? null;

    return {
      id: entity.id,
      userId: entity.userId,
      monitoringLocationId: entity.monitoringLocationId,
      parameterCode: entity.parameterCode,
      parameterValueForFuel: entity.parameterValueForFuel,
      formulaId,
      monitoringFormulaRecordId: entity.formulaIdentifier,
      sampleTypeCode: entity.sampleTypeCode,
      monitoringSystemId,
      operatingConditionCode: entity.operatingConditionCode,
      segmentNumber: entity.segmentNumber,
      parameterUnitsOfMeasureCode: entity.parameterUomCode,
      hourlyFuelFlowId: entity.hourlyFuelFlowId,
      calcParamValFuel: entity.calcParamValFuel,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      calcAppeStatus: entity.calcAppeStatus,
      reportingPeriodId: entity.reportingPeriodId,
    };
  }
}
