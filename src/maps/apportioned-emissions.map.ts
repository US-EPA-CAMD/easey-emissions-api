import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { ApportionedEmissionsDTO } from '../dto/apportioned-emissions.dto';

@Injectable()
export class ApportionedEmissionsMap extends BaseMap<any, any> {
  public async one(entity: any): Promise<ApportionedEmissionsDTO> {
    return {
      state: entity.unitFact.state,
      facilityName: entity.unitFact.facilityName,
      orisCode: entity.unitFact.orisCode
        ? Number(entity.unitFact.orisCode)
        : entity.unitFact.orisCode,
      unitId: entity.unitFact.unitid,
      gLoad: entity.gload ? Number(entity.gload) : entity.gload,
      sLoad: entity.sload ? Number(entity.sload) : entity.sload,
      so2Mass: entity.so2Mass ? Number(entity.so2Mass) : entity.so2Mass,
      so2Rate: entity.so2Rate ? Number(entity.so2Rate) : entity.so2Rate,
      noxMass: entity.noxMass ? Number(entity.noxMass) : entity.noxMass,
      noxRate: entity.noxRate ? Number(entity.noxRate) : entity.noxRate,
      co2Mass: entity.co2Mass ? Number(entity.co2Mass) : entity.co2Mass,
      co2Rate: entity.co2Rate ? Number(entity.co2Rate) : entity.co2Rate,
      heatInput: entity.heatInput ? Number(entity.heatInput) : entity.heatInput,
      primaryFuelInfo: entity.unitFact.primaryFuelInfo,
      secondaryFuelInfo: entity.unitFact.secondaryFuelInfo,
      unitTypeInfo: entity.unitFact.unitTypeInfo,
      so2ControlInfo: entity.unitFact.so2ControlInfo,
      partControlInfo: entity.unitFact.partControlInfo,
      noxControlInfo: entity.unitFact.noxControlInfo,
      hgControlInfo: entity.unitFact.hgControlInfo,
      prgCodeInfo: entity.unitFact.prgCodeInfo,
      assocStacks: entity.unitFact.assocStacks,
    };
  }
}
