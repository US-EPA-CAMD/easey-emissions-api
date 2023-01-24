import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { DailyApportionedEmissionsAggregationDTO } from './daily-apportioned-emissions-aggregation.dto';

export class DailyApportionedEmissionsStateAggregationDTO extends DailyApportionedEmissionsAggregationDTO {
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
