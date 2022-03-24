import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsValidNumber,
  IsInEnum,
  IsInResponse,
  IsNotEmptyString,
} from '@us-epa-camd/easey-common/pipes';
import { IsOptional } from 'class-validator';

import {
  propertyMetadata,
  ErrorMessages,
} from '@us-epa-camd/easey-common/constants';
import { ExcludeApportionedEmissions } from '@us-epa-camd/easey-common/enums';

import { OpYear, Page, PerPage } from '../utils/validator.const';
import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { IsInValidReportingQuarter } from '../pipes/is-in-valid-reporting-quarter.pipe';
import { fieldMappings } from '../constants/field-mappings';

export class QuarterlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @ApiProperty({
    isArray: true,
    description: propertyMetadata.year.description,
  })
  @OpYear()
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  year: number[];

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.quarter.description,
  })
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
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
  @Page()
  page: number;

  @ApiProperty({
    description: propertyMetadata.perPage.description,
  })
  @PerPage()
  perPage: number;
}

export class StreamQuarterlyApportionedEmissionsParamsDTO extends QuarterlyApportionedEmissionsParamsDTO {
  @ApiProperty({
    enum: ExcludeApportionedEmissions,
    description: propertyMetadata.exclude.description,
  })
  @IsOptional()
  @IsInEnum(ExcludeApportionedEmissions, {
    each: true,
    message: ErrorMessages.RemovableParameter(),
  })
  @IsInResponse(fieldMappings.emissions.quarterly, {
    each: true,
    message: ErrorMessages.ValidParameter(),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  exclude?: ExcludeApportionedEmissions[];
}
