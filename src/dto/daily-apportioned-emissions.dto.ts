import { ApiProperty } from '@nestjs/swagger';

import { propertyMetadata } from '@us-epa-camd/easey-constants';
import { ApportionedEmissionsDTO } from './apportioned-emissions.dto';

export class DailyApportionedEmissionsDTO extends ApportionedEmissionsDTO {
  @ApiProperty(propertyMetadata.date)
  opDate: string;

  @ApiProperty(propertyMetadata.sumOpTime)  
  sumOpTime: number;

  @ApiProperty(propertyMetadata.countOpTime)  
  countOpTime: number;
}
