import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';
import { IsInDateRange, IsYearFormat } from '@us-epa-camd/easey-common/pipes';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AnnualApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @ApiProperty({
    isArray: true,
    description: propertyMetadata.year.description,
  })
  @IsYearFormat({
    each: true,
    message: ErrorMessages.MultipleFormat('year', 'YYYY format'),
  })
  @IsInDateRange([new Date(1995, 0), new Date()], true, true, true, {
    each: true,
    message: ErrorMessages.DateRange(
      'year',
      true,
      '1980, 1985, 1990, or to a year between 1995 and this year',
    ),
  })
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  year: number[];
}
