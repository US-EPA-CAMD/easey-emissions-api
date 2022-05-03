import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { ApportionedEmissionsAggregationDTO } from './apportioned-emissions-aggregation.dto';

export class AnnualApportionedEmissionsAggregationDTO extends ApportionedEmissionsAggregationDTO {
  constructor() {
    super();
  }

  @ApiProperty({
    description: propertyMetadata.year.description,
    example: propertyMetadata.year.example,
    name: propertyMetadata.year.fieldLabels.value,
  })
  year: number;
}
