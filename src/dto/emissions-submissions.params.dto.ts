import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsValidDate } from '@us-epa-camd/easey-common/pipes';

export class EmissionsSubmissionsParamsDTO {
  @IsValidDate()
  @ApiProperty({
    example: propertyMetadata.date.example,
    description: propertyMetadata.date.description,
  })
  submissionPeriod: Date;
}
