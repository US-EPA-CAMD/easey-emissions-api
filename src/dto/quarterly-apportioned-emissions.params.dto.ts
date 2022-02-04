import { IsDefined, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import {
  propertyMetadata,
  ErrorMessages
} from '@us-epa-camd/easey-common/constants';

import {
  IsValidNumber,
  IsInRange,
  Min,
} from '@us-epa-camd/easey-common/pipes';

import { OpYear } from '../utils/validator.const';
import { PAGINATION_MAX_PER_PAGE } from '../config/app.config';
import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { IsInValidReportingQuarter } from '../pipes/is-in-valid-reporting-quarter.pipe';

export class QuarterlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @ApiProperty({
    isArray: true,
    description: propertyMetadata.year.description,
  })
  @OpYear()
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  year: number[];

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.quarter.description,
  })
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  @IsValidNumber(4, {
    each: true,
    message: ErrorMessages.MultipleFormat(
      'quarter',
      'single digit format (ex.1,2,3,4)',
    ),
  })
  @IsInValidReportingQuarter([1, 2, 3], 'year', {
    each: true,
    message: ErrorMessages.DateRange(
      'quarter',
      true,
      `a quarter between 01/01/1995 and the quarter ending on ${ErrorMessages.ReportingQuarter()}`,
    ),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  quarter: number[];
}

export class PaginatedQuarterlyApportionedEmissionsParamsDTO extends QuarterlyApportionedEmissionsParamsDTO {
  @ApiProperty({
    description: propertyMetadata.page.description,
  })
  @IsDefined()
  @IsNumber()
  @Min(1, {
    message: ErrorMessages.GreaterThanOrEqual('page', 1),
  })  
  page: number;

  @ApiProperty({
    description: propertyMetadata.perPage.description,
  })
  @IsDefined()
  @IsNumber()  
  @IsInRange(1, PAGINATION_MAX_PER_PAGE, {
    message: ErrorMessages.Between('perPage', 1, PAGINATION_MAX_PER_PAGE),
  })
  perPage: number;
}
