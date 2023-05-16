import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { SorbentTrapDTO } from '../dto/sorbent-trap.dto';
import { SorbentTrap } from '../entities/sorbent-trap.entity';
import { SorbentTrap as SorbentTrapWorkspace } from '../entities/workspace/sorbent-trap.entity';

@Injectable()
export class SorbentTrapMap extends BaseMap<
  SorbentTrap | SorbentTrapWorkspace,
  SorbentTrapDTO
> {
  public async one(
    entity: SorbentTrap | SorbentTrapWorkspace,
  ): Promise<SorbentTrapDTO> {
    return {
      id: entity.id,
      unitId: entity.monitorLocation?.unit?.name ?? null,
      stackPipeId: entity.monitorLocation?.stackPipe?.name ?? null,
      monitoringLocationId: entity.monitorLocation?.id ?? null,
      reportingPeriodId: entity.reportingPeriodId,
      monitoringSystemRecordId: entity.monitoringSystemId,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      endDate: entity.endDate,
      endHour: entity.endHour,
      monitoringSystemId: entity.monitorSystem?.monitoringSystemId ?? null,
      pairedTrapAgreement: entity.pairedTrapAgreement,
      absoluteDifferenceIndicator: entity.absoluteDifferenceIndicator,
      modcCode: entity.modcCode,
      hgSystemConcentration: entity.hgSystemConcentration,
      apsCode: entity.apsCode,
      rataIndicator: entity.rataIndicator,
      calcPairedTrapAgreement: entity.calcPairedTrapAgreement,
      calcModcCode: entity.calcModcCode,
      calcHgConcentration: entity.calcHgConcentration,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      samplingTrainData: [],
    };
  }
}
