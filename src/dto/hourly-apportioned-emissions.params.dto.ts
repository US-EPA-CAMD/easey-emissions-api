import { IsOptional } from 'class-validator';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { BeginDate, EndDate } from '../utils/validator.const';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '../constants/property-metadata';

export class HourlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @BeginDate()
  @ApiProperty({ description: propertyMetadata.beginDate.description })
  beginDate: Date;

  @EndDate()
  @ApiProperty({ description: propertyMetadata.endDate.description })
  endDate: Date;

  @IsOptional()
  @ApiProperty({ description: propertyMetadata.opHoursOnly.description })
  opHoursOnly?: boolean;
}
