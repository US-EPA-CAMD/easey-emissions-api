import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { ApportionedEmissionsAggregationDTO } from './apportioned-emissions-aggregation.dto';

export class HourlyApportionedEmissionsAggregationDTO extends ApportionedEmissionsAggregationDTO {
  constructor() {
    super();
  }
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
}
