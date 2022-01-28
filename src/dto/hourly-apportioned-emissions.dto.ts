import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { ApportionedEmissionsDTO } from './apportioned-emissions.dto';

export class HourlyApportionedEmissionsDTO extends ApportionedEmissionsDTO {
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

  @ApiProperty({
    description: propertyMetadata.opTime.description,
    example: propertyMetadata.opTime.example,
    name: propertyMetadata.opTime.fieldLabels.value,
  })
  opTime?: number;
}
