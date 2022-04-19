import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import {
  propertyMetadata,
  ErrorMessages,
} from '@us-epa-camd/easey-common/constants';

import {
  IsInDateRange,
  IsYearFormat,
  IsInEnum,
  IsInResponse,
  IsNotEmptyString,
} from '@us-epa-camd/easey-common/pipes';
import { ExcludeApportionedEmissions } from '@us-epa-camd/easey-common/enums';

import { fieldMappings } from '../constants/field-mappings';
import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { Page, PerPage } from '../utils/validator.const';

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
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  year: number[];
}

export class PaginatedAnnualApportionedEmissionsParamsDTO extends AnnualApportionedEmissionsParamsDTO {
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

export class StreamAnnualApportionedEmissionsParamsDTO extends AnnualApportionedEmissionsParamsDTO {
  @ApiProperty({
    enum: ExcludeApportionedEmissions,
    description: propertyMetadata.exclude.description,
  })
  @IsOptional()
  @IsInEnum(ExcludeApportionedEmissions, {
    each: true,
    message: ErrorMessages.RemovableParameter(),
  })
  @IsInResponse(fieldMappings.emissions.annual.data.aggregation.unit, {
    each: true,
    message: ErrorMessages.ValidParameter(),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  exclude?: ExcludeApportionedEmissions[];
}
