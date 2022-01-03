import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

@Injectable()
export class ApportionedEmissionsMap extends BaseMap<any, any> {
  public async one(entity: any): Promise<any> {
    return {
      [propertyMetadata.stateCode.fieldLabels.value]: entity.unitFact.stateCode,
      [propertyMetadata.facilityName.fieldLabels.value]:
        entity.unitFact.facilityName,
      [propertyMetadata.facilityId.fieldLabels.value]: entity.unitFact
        .facilityId
        ? Number(entity.unitFact.facilityId)
        : entity.unitFact.facilityId,
      [propertyMetadata.unitId.fieldLabels.value]: entity.unitFact.unitId,
      [propertyMetadata.associatedStacks.fieldLabels.value]:
        entity.unitFact.associatedStacks,
      [propertyMetadata.grossLoad.fieldLabels.value]: entity.grossLoad
        ? Number(entity.grossLoad)
        : entity.grossLoad,
      [propertyMetadata.steamLoad.fieldLabels.value]: entity.steamLoad
        ? Number(entity.steamLoad)
        : entity.steamLoad,
      [propertyMetadata.so2Mass.fieldLabels.value]: entity.so2Mass
        ? Number(entity.so2Mass)
        : entity.so2Mass,
      [propertyMetadata.so2Rate.fieldLabels.value]: entity.so2Rate
        ? Number(entity.so2Rate)
        : entity.so2Rate,
      [propertyMetadata.noxMass.fieldLabels.value]: entity.noxMass
        ? Number(entity.noxMass)
        : entity.noxMass,
      [propertyMetadata.noxRate.fieldLabels.value]: entity.noxRate
        ? Number(entity.noxRate)
        : entity.noxRate,
      [propertyMetadata.co2Mass.fieldLabels.value]: entity.co2Mass
        ? Number(entity.co2Mass)
        : entity.co2Mass,
      [propertyMetadata.co2Rate.fieldLabels.value]: entity.co2Rate
        ? Number(entity.co2Rate)
        : entity.co2Rate,
      [propertyMetadata.heatInput.fieldLabels.value]: entity.heatInput
        ? Number(entity.heatInput)
        : entity.heatInput,
      [propertyMetadata.primaryFuelInfo.fieldLabels.value]:
        entity.unitFact.primaryFuelInfo,
      [propertyMetadata.secondaryFuelInfo.fieldLabels.value]:
        entity.unitFact.secondaryFuelInfo,
      [propertyMetadata.unitType.fieldLabels.value]: entity.unitFact.unitType,
      [propertyMetadata.so2ControlInfo.fieldLabels.value]:
        entity.unitFact.so2ControlInfo,
      [propertyMetadata.pmControlInfo.fieldLabels.value]:
        entity.unitFact.pmControlInfo,
      [propertyMetadata.noxControlInfo.fieldLabels.value]:
        entity.unitFact.noxControlInfo,
      [propertyMetadata.hgControlInfo.fieldLabels.value]:
        entity.unitFact.hgControlInfo,
      [propertyMetadata.programCodeInfo.fieldLabels.value]:
        entity.unitFact.programCodeInfo,
    };
  }
}
