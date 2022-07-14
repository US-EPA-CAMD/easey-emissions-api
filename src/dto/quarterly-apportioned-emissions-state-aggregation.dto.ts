import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { QuarterlyApportionedEmissionsAggregationDTO } from './quarterly-apportioned-emissions-aggregation.dto';

export class QuarterlyApportionedEmissionsStateAggregationDTO extends QuarterlyApportionedEmissionsAggregationDTO {
  constructor() {
    super();
  }
  @ApiProperty({
    description: propertyMetadata.stateCode.description,
    example: propertyMetadata.stateCode.example,
    name: propertyMetadata.stateCode.fieldLabels.value,
  })
  stateCode: string;
}
