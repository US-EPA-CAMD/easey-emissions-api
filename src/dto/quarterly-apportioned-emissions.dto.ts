import { ApiProperty } from '@nestjs/swagger';

import { propertyMetadata } from '@us-epa-camd/easey-constants';
import { ApportionedEmissionsDTO } from './apportioned-emissions.dto';

export class QuarterlyApportionedEmissionsDTO extends ApportionedEmissionsDTO {
  @ApiProperty(propertyMetadata.year)
  opYear: number;

  @ApiProperty(propertyMetadata.quarter)
  opQuarter: number;

  @ApiProperty(propertyMetadata.sumOpTime)
  sumOpTime: number;

  @ApiProperty(propertyMetadata.countOpTime)
  countOpTime: number;
}
