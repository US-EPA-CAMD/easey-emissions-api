import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { propertyMetadata } from '@us-epa-camd/easey-constants';

export class QuarterlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @IsDefined()
  @ApiProperty(propertyMetadata.year)
  opYear: number[];

  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @IsDefined()
  @ApiProperty(propertyMetadata.quarter)
  opQuarter: number[];
}
