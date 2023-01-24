import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { QuarterlyApportionedEmissionsAggregationDTO } from './quarterly-apportioned-emissions-aggregation.dto';

export class QuarterlyApportionedEmissionsFacilityAggregationDTO extends QuarterlyApportionedEmissionsAggregationDTO {
  constructor() {
    super();
  }

  @ApiProperty({
    description: propertyMetadata.facilityId.description,
    example: propertyMetadata.facilityId.example,
    name: propertyMetadata.facilityId.fieldLabels.value,
  })
  facilityId?: number;

  @ApiProperty({
    description: propertyMetadata.facilityName.description,
    example: propertyMetadata.facilityName.example,
    name: propertyMetadata.facilityName.fieldLabels.value,
  })
  facilityName: string;

  @ApiProperty({
    description: propertyMetadata.stateCode.description,
    example: propertyMetadata.stateCode.example,
    name: propertyMetadata.stateCode.fieldLabels.value,
  })
  stateCode: string;
}
