import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { ApportionedEmissionsAggregationDTO } from './apportioned-emissions-aggregation.dto';

export class QuarterlyApportionedEmissionsAggregationDTO extends ApportionedEmissionsAggregationDTO {
  constructor() {
    super();
  }

  @ApiProperty({
    description: propertyMetadata.year.description,
    example: propertyMetadata.year.example,
    name: propertyMetadata.year.fieldLabels.value,
  })
  year: number;

  @ApiProperty({
    description: propertyMetadata.quarter.description,
    example: propertyMetadata.quarter.example,
    name: propertyMetadata.quarter.fieldLabels.value,
  })
  quarter: number;
}
