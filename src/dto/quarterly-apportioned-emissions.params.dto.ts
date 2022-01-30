import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import {
  propertyMetadata,
  ErrorMessages
} from '@us-epa-camd/easey-common/constants';

import { OpYear } from '../utils/validator.const';
import { IsValidNumber } from '../pipes/is-valid-number.pipe';
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
  page: number;

  @ApiProperty({
    description: propertyMetadata.perPage.description,
  })
  perPage: number;
}