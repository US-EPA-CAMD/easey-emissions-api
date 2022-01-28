import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { UnitFact } from '../entities/unit-fact.entity';
import { UnitFactDTO } from '../dto/unit-fact.dto';

@Injectable()
export class UnitFactMap extends BaseMap<UnitFact, UnitFactDTO> {
  public async one(entity: UnitFact): Promise<UnitFactDTO> {
    return {
      stateCode: entity.stateCode,
      facilityName: entity.facilityName,
      facilityId: entity.facilityId
        ? Number(entity.facilityId)
        : entity.facilityId,
      unitId: entity.unitId,
      unitType: entity.unitType,
      associatedStacks: entity.associatedStacks,
      primaryFuelInfo: entity.primaryFuelInfo,
      secondaryFuelInfo: entity.secondaryFuelInfo,
      so2ControlInfo: entity.so2ControlInfo,
      pmControlInfo: entity.pmControlInfo,
      noxControlInfo: entity.noxControlInfo,
      hgControlInfo: entity.hgControlInfo,
      programCodeInfo: entity.programCodeInfo,
    };
  }
}
