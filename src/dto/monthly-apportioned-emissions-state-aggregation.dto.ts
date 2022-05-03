import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { MonthlyApportionedEmissionsAggregationDTO } from './monthly-apportioned-emissions-aggregation.dto';

export class MonthlyApportionedEmissionsStateAggregationDTO extends MonthlyApportionedEmissionsAggregationDTO {
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
