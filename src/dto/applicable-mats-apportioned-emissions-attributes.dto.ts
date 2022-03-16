import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class ApplicableMatsApportionedEmissionsAttributesDTO {
  @ApiProperty({
    description: propertyMetadata.date.description,
    example: propertyMetadata.date.example,
    name: propertyMetadata.date.fieldLabels.value,
  })
  date: string;

  @ApiProperty({
    description: propertyMetadata.facilityId.description,
    example: propertyMetadata.facilityId.example,
    name: propertyMetadata.facilityId.fieldLabels.value,
  })
  facilityId: number;

  @ApiProperty({
    description: propertyMetadata.stateCode.description,
    example: propertyMetadata.stateCode.example,
    name: propertyMetadata.stateCode.fieldLabels.value,
  })
  stateCode: string;

  @ApiProperty({
    description: propertyMetadata.unitTypeCode.description,
    example: propertyMetadata.unitTypeCode.example,
    name: propertyMetadata.unitTypeCode.fieldLabels.value,
  })
  unitTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.fuelTypeCode.description,
    example: propertyMetadata.fuelTypeCode.example,
    name: propertyMetadata.fuelTypeCode.fieldLabels.value,
  })
  fuelTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.controlCode.description,
    example: propertyMetadata.controlCode.example,
    name: propertyMetadata.controlCode.fieldLabels.value,
  })
  controlCode: string;
}
