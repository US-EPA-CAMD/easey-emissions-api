import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class HourlyApportionedEmissionsFacilityAggregationDTO {
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
    description: propertyMetadata.date.description,
    example: propertyMetadata.date.example,
    name: propertyMetadata.date.fieldLabels.value,
  })
  date: string;

  @ApiProperty({
    description: propertyMetadata.hour.description,
    example: propertyMetadata.hour.example,
    name: propertyMetadata.hour.fieldLabels.value,
  })
  hour: number;

  @ApiProperty({
    description: propertyMetadata.grossLoadHourly.description,
    example: propertyMetadata.grossLoadHourly.example,
    name: propertyMetadata.grossLoadHourly.fieldLabels.value,
  })
  grossLoad?: number;

  @ApiProperty({
    description: propertyMetadata.steamLoadHourly.description,
    example: propertyMetadata.steamLoadHourly.example,
    name: propertyMetadata.steamLoadHourly.fieldLabels.value,
  })
  steamLoad?: number;

  @ApiProperty({
    description: propertyMetadata.so2MassHourly.description,
    example: propertyMetadata.so2MassHourly.example,
    name: propertyMetadata.so2MassHourly.fieldLabels.value,
  })
  so2Mass?: number;

  @ApiProperty({
    description: propertyMetadata.co2Mass.description,
    example: propertyMetadata.co2Mass.example,
    name: propertyMetadata.co2Mass.fieldLabels.value,
  })
  co2Mass?: number;

  @ApiProperty({
    description: propertyMetadata.noxMassHourly.description,
    example: propertyMetadata.noxMassHourly.example,
    name: propertyMetadata.noxMassHourly.fieldLabels.value,
  })
  noxMass?: number;

  @ApiProperty({
    description: propertyMetadata.heatInput.description,
    example: propertyMetadata.heatInput.example,
    name: propertyMetadata.heatInput.fieldLabels.value,
  })
  heatInput?: number;
}
