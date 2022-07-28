import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { OzoneApportionedEmissionsAggregationDTO } from './ozone-apportioned-emissions-aggregation.dto';

export class OzoneApportionedEmissionsStateAggregationDTO extends OzoneApportionedEmissionsAggregationDTO {
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
