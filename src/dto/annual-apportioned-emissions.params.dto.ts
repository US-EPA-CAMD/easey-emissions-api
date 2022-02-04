import { IsDefined, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import {
  propertyMetadata,
  ErrorMessages
} from '@us-epa-camd/easey-common/constants';

import {
  IsInDateRange,
  IsYearFormat,
  IsInRange,
  Min,
} from '@us-epa-camd/easey-common/pipes';

import { PAGINATION_MAX_PER_PAGE } from '../config/app.config';
import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';

export class AnnualApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @ApiProperty({
    isArray: true,
    description: propertyMetadata.year.description,
  })
  @IsYearFormat({
    each: true,
    message: ErrorMessages.MultipleFormat('year', 'YYYY format'),
  })
  @IsInDateRange([new Date(1995, 0), 'currentDate'], true, true, true, {
    each: true,
    message: ErrorMessages.DateRange(
      'year',
      true,
      `1980, 1985, 1990, or to a year between 1995 and the quarter ending on ${ErrorMessages.ReportingQuarter()}`,
    ),
  })
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  year: number[];
}

export class PaginatedAnnualApportionedEmissionsParamsDTO extends AnnualApportionedEmissionsParamsDTO {
  @ApiProperty({
    description: propertyMetadata.page.description,
  })
  @IsDefined()
  @Min(1, {
    message: ErrorMessages.GreaterThanOrEqual('page', 1),
  })  
  page: number;

  @ApiProperty({
    description: propertyMetadata.perPage.description,
  })
  @IsDefined()
  @IsInRange(1, PAGINATION_MAX_PER_PAGE, {
    message: ErrorMessages.Between('perPage', 1, PAGINATION_MAX_PER_PAGE),
  })
  perPage: number;
}
