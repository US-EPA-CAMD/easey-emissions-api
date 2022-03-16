import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class UnitFactDTO {
  @ApiProperty({
    description: propertyMetadata.stateCode.description,
    example: propertyMetadata.stateCode.example,
    name: propertyMetadata.stateCode.fieldLabels.value,
  })
  stateCode: string;

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
    description: propertyMetadata.unitType.description,
    example: propertyMetadata.unitType.example,
    name: propertyMetadata.unitType.fieldLabels.value,
  })
  unitType: string;

  @ApiProperty({
    description: propertyMetadata.associatedStacks.description,
    example: propertyMetadata.associatedStacks.example,
    name: propertyMetadata.associatedStacks.fieldLabels.value,
  })
  associatedStacks: string;

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
}
