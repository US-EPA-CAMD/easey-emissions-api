import { ApiProperty } from "@nestjs/swagger";

import { propertyMetadata } from '@us-epa-camd/easey-constants';

export class ApportionedEmissionsDTO {
  @ApiProperty(propertyMetadata.state)
  state: string;

  @ApiProperty(propertyMetadata.facilityName)
  facilityName: string;

  @ApiProperty(propertyMetadata.facilityId)
  orisCode: number;

  @ApiProperty(propertyMetadata.unitId)
  unitId: string;

  @ApiProperty(propertyMetadata.associatedStacks)
  assocStacks: string;

  @ApiProperty(propertyMetadata.grossLoad)
  gLoad: number;

  @ApiProperty(propertyMetadata.steamLoad)
  sLoad: number;

  @ApiProperty(propertyMetadata.so2Mass)
  so2Mass: number;

  @ApiProperty(propertyMetadata.so2Rate)
  so2Rate: number;

  @ApiProperty(propertyMetadata.noxMass)
  noxMass: number;

  @ApiProperty(propertyMetadata.noxRate)
  noxRate: number;

  @ApiProperty(propertyMetadata.co2Mass)
  co2Mass: number;

  @ApiProperty(propertyMetadata.co2Rate)
  co2Rate: number;

  @ApiProperty(propertyMetadata.heatInput)
  heatInput: number;

  @ApiProperty(propertyMetadata.primaryFuelInfo)
  primaryFuelInfo: string;

  @ApiProperty(propertyMetadata.secondaryFuelInfo)
  secondaryFuelInfo: string;

  @ApiProperty(propertyMetadata.unitType)
  unitTypeInfo: string;

  @ApiProperty(propertyMetadata.so2ControlInfo)
  so2ControlInfo: string;

  @ApiProperty(propertyMetadata.pmControlInfo)
  partControlInfo: string;

  @ApiProperty(propertyMetadata.noxControlInfo)
  noxControlInfo: string;

  @ApiProperty(propertyMetadata.hgControlInfo)
  hgControlInfo: string;

  @ApiProperty(propertyMetadata.programCodeInfo)
  prgCodeInfo: string;
}
