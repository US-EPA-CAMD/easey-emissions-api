import { ApiProperty } from '@nestjs/swagger';

import { propertyMetadata } from '@us-epa-camd/easey-constants';

export class ApportionedEmissionsDTO {
  @ApiProperty({
    description: propertyMetadata.state.description,
    example: propertyMetadata.state.example,
    name: propertyMetadata.state.fieldLabels.value,
  })
  state: string;

  @ApiProperty({
    description: propertyMetadata.facilityName.description,
    example: propertyMetadata.facilityName.example,
    name: propertyMetadata.facilityName.fieldLabels.value,
  })
  facilityName: string;

  @ApiProperty({
    description: propertyMetadata.facilityId.description,
    example: propertyMetadata.facilityId.example,
    name: propertyMetadata.facilityId.fieldLabels.value,
  })
  facilityId?: number;

  @ApiProperty({
    description: propertyMetadata.unitId.description,
    example: propertyMetadata.unitId.example,
    name: propertyMetadata.unitId.fieldLabels.value,
  })
  unitId: string;

  @ApiProperty({
    description: propertyMetadata.associatedStacks.description,
    example: propertyMetadata.associatedStacks.example,
    name: propertyMetadata.associatedStacks.fieldLabels.value,
  })
  associatedStacks: string;

  @ApiProperty({
    description: propertyMetadata.grossLoad.description,
    example: propertyMetadata.grossLoad.example,
    name: propertyMetadata.grossLoad.fieldLabels.value,
  })
  grossLoad?: number;

  @ApiProperty({
    description: propertyMetadata.steamLoad.description,
    example: propertyMetadata.steamLoad.example,
    name: propertyMetadata.steamLoad.fieldLabels.value,
  })
  steamLoad?: number;

  @ApiProperty({
    description: propertyMetadata.so2Mass.description,
    example: propertyMetadata.so2Mass.example,
    name: propertyMetadata.so2Mass.fieldLabels.value,
  })
  so2Mass?: number;

  @ApiProperty({
    description: propertyMetadata.so2Rate.description,
    example: propertyMetadata.so2Rate.example,
    name: propertyMetadata.so2Rate.fieldLabels.value,
  })
  so2Rate?: number;

  @ApiProperty({
    description: propertyMetadata.noxMass.description,
    example: propertyMetadata.noxMass.example,
    name: propertyMetadata.noxMass.fieldLabels.value,
  })
  noxMass?: number;

  @ApiProperty({
    description: propertyMetadata.noxRate.description,
    example: propertyMetadata.noxRate.example,
    name: propertyMetadata.noxRate.fieldLabels.value,
  })
  noxRate?: number;

  @ApiProperty({
    description: propertyMetadata.co2Mass.description,
    example: propertyMetadata.co2Mass.example,
    name: propertyMetadata.co2Mass.fieldLabels.value,
  })
  co2Mass?: number;

  @ApiProperty({
    description: propertyMetadata.co2Rate.description,
    example: propertyMetadata.co2Rate.example,
    name: propertyMetadata.co2Rate.fieldLabels.value,
  })
  co2Rate?: number;

  @ApiProperty({
    description: propertyMetadata.heatInput.description,
    example: propertyMetadata.heatInput.example,
    name: propertyMetadata.heatInput.fieldLabels.value,
  })
  heatInput?: number;

  @ApiProperty({
    description: propertyMetadata.primaryFuelInfo.description,
    example: propertyMetadata.primaryFuelInfo.example,
    name: propertyMetadata.primaryFuelInfo.fieldLabels.value,
  })
  primaryFuelInfo: string;

  @ApiProperty({
    description: propertyMetadata.secondaryFuelInfo.description,
    example: propertyMetadata.secondaryFuelInfo.example,
    name: propertyMetadata.secondaryFuelInfo.fieldLabels.value,
  })
  secondaryFuelInfo: string;

  @ApiProperty({
    description: propertyMetadata.unitType.description,
    example: propertyMetadata.unitType.example,
    name: propertyMetadata.unitType.fieldLabels.value,
  })
  unitType: string;

  @ApiProperty({
    description: propertyMetadata.so2ControlInfo.description,
    example: propertyMetadata.so2ControlInfo.example,
    name: propertyMetadata.so2ControlInfo.fieldLabels.value,
  })
  so2ControlInfo: string;

  @ApiProperty({
    description: propertyMetadata.pmControlInfo.description,
    example: propertyMetadata.pmControlInfo.example,
    name: propertyMetadata.pmControlInfo.fieldLabels.value,
  })
  pmControlInfo: string;

  @ApiProperty({
    description: propertyMetadata.noxControlInfo.description,
    example: propertyMetadata.noxControlInfo.example,
    name: propertyMetadata.noxControlInfo.fieldLabels.value,
  })
  noxControlInfo: string;

  @ApiProperty({
    description: propertyMetadata.hgControlInfo.description,
    example: propertyMetadata.hgControlInfo.example,
    name: propertyMetadata.hgControlInfo.fieldLabels.value,
  })
  hgControlInfo: string;

  @ApiProperty({
    description: propertyMetadata.programCodeInfo.description,
    example: propertyMetadata.programCodeInfo.example,
    name: propertyMetadata.programCodeInfo.fieldLabels.value,
  })
  programCodeInfo: string;
}
