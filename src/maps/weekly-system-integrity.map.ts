import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { WeeklySystemIntegrity as WeeklySystemIntegrityWorkspace } from '../entities/workspace/weekly-system-integrity.entity';
import { WeeklySystemIntegrity } from '../entities/weekly-system-integrity.entity';
import { WeeklySystemIntegrityDTO } from '../dto/weekly-system-integrity.dto';

@Injectable()
export class WeeklySystemIntegrityMap extends BaseMap<
  WeeklySystemIntegrity | WeeklySystemIntegrityWorkspace,
  WeeklySystemIntegrityDTO
> {
  public async one(
    entity: WeeklySystemIntegrity | WeeklySystemIntegrityWorkspace,
  ): Promise<WeeklySystemIntegrityDTO> {
    return {
      id: entity.id,
      weeklyTestSumId: entity.weeklyTestSumId,
      gasLevelCode: entity.gasLevelCode,
      referenceValue: entity.referenceValue,
      measuredValue: entity.measuredValue,
      apsIndicator: entity.apsIndicator,
      systemIntegrityError: entity.systemIntegrityError,
      calcSystemIntegrityError: entity.calcSystemIntegrityError,
      calcApsInd: entity.calcApsInd,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      reportingPeriodId: entity.reportingPeriodId,
      monitoringLocationId: entity.monitoringLocationId,
    };
  }
}
