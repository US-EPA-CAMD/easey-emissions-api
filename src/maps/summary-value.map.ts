import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { SummaryValue } from '../entities/summary-value.entity';
import { SummaryValue as SummaryValueWorkspace } from '../entities/workspace/summary-value.entity';
import { SummaryValueDTO } from '../dto/summary-value.dto';

@Injectable()
export class SummaryValueMap extends BaseMap<
  SummaryValue | SummaryValueWorkspace,
  SummaryValueDTO
> {
  public async one(
    entity: SummaryValue | SummaryValueWorkspace,
  ): Promise<SummaryValueDTO> {
    const unitId = entity?.monitorLocation?.unit?.name ?? null;

    const stackPipeId = entity?.monitorLocation?.stackPipe?.name ?? null;

    return {
      id: entity.id,
      reportingPeriodId: entity.reportingPeriodId,
      monitoringLocationId: entity.monitoringLocationId,
      calcCurrentRptPeriodTotal: entity.calcCurrentRptPeriodTotal,
      calcOsTotal: entity.calcOsTotal,
      calcYearTotal: entity.calcYearTotal,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      stackPipeId,
      unitId,
      parameterCode: entity.parameterCode,
      currentReportingPeriodTotal: entity.currentReportingPeriodTotal,
      ozoneSeasonToDateTotal: entity.ozoneSeasonToDateTotal,
      yearToDateTotal: entity.yearToDateTotal,
    };
  }
}
