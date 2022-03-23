import { IsOptional, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsValidNumber,
  IsInRange,
  Min,
  IsInEnum,
  IsInResponse,
  IsNotEmptyString,
} from '@us-epa-camd/easey-common/pipes';

import {
  propertyMetadata,
  ErrorMessages,
} from '@us-epa-camd/easey-common/constants';
import { ExcludeApportionedEmissions } from '@us-epa-camd/easey-common/enums';

import { OpYear } from '../utils/validator.const';
import { PAGINATION_MAX_PER_PAGE } from './../config/app.config';
import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { IsInValidReportingQuarter } from '../pipes/is-in-valid-reporting-quarter.pipe';
import { fieldMappings } from '../constants/field-mappings';

export class MonthlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @ApiProperty({
    isArray: true,
    description: propertyMetadata.year.description,
  })
  @OpYear()
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  year: number[];

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.month.description,
  })
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
  @IsValidNumber(12, {
    each: true,
    message: ErrorMessages.MultipleFormat('month', 'M or MM format'),
  })
  @IsInValidReportingQuarter([3, 6, 9], 'year', {
    each: true,
    message: ErrorMessages.DateRange(
      'month',
      true,
      `a month between 01/01/1995 and the quarter ending on ${ErrorMessages.ReportingQuarter()}`,
    ),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  month: number[];
}

export class PaginatedMonthlyApportionedEmissionsParamsDTO extends MonthlyApportionedEmissionsParamsDTO {
  @ApiProperty({
    description: propertyMetadata.page.description,
  })
  @IsNotEmpty({ message: ErrorMessages.RequiredProperty() })
  @Min(1, {
    message: ErrorMessages.GreaterThanOrEqual('page', 1),
  })
  page: number;

  @ApiProperty({
    description: propertyMetadata.perPage.description,
  })
  @IsNotEmpty({ message: ErrorMessages.RequiredProperty() })
  @IsInRange(1, PAGINATION_MAX_PER_PAGE, {
    message: ErrorMessages.Between('perPage', 1, PAGINATION_MAX_PER_PAGE),
  })
  perPage: number;
}

export class StreamMonthlyApportionedEmissionsParamsDTO extends MonthlyApportionedEmissionsParamsDTO {
  @ApiProperty({
    enum: ExcludeApportionedEmissions,
    description: propertyMetadata.exclude.description,
  })
  @IsOptional()
  @IsInEnum(ExcludeApportionedEmissions, {
    each: true,
    message: ErrorMessages.RemovableParameter(),
  })
  @IsInResponse(fieldMappings.emissions.monthly, {
    each: true,
    message: ErrorMessages.ValidParameter(),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  exclude?: ExcludeApportionedEmissions[];
}
