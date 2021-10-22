import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { ApportionedEmissionsDTO } from './apportioned-emissions.dto';

export class DailyApportionedEmissionsDTO extends ApportionedEmissionsDTO {
  @ApiProperty({
    description: propertyMetadata.date.description,
    example: propertyMetadata.date.example,
    name: propertyMetadata.date.fieldLabels.value,
  })
  date: string;

  @ApiProperty({
    description: propertyMetadata.sumOpTime.description,
    example: propertyMetadata.sumOpTime.example,
    name: propertyMetadata.sumOpTime.fieldLabels.value,
  })
  sumOpTime?: number;

  @ApiProperty({
    description: propertyMetadata.countOpTime.description,
    example: propertyMetadata.countOpTime.example,
    name: propertyMetadata.countOpTime.fieldLabels.value,
  })
  countOpTime?: number;
}
