import { IsDefined, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidNumber, IsInRange, Min } from '@us-epa-camd/easey-common/pipes';
import { Program } from '@us-epa-camd/easey-common/enums';

import {
  propertyMetadata,
  ErrorMessages,
} from '@us-epa-camd/easey-common/constants';

import { OpYear } from '../utils/validator.const';
import { PAGINATION_MAX_PER_PAGE } from './../config/app.config';
import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { IsInValidReportingQuarter } from '../pipes/is-in-valid-reporting-quarter.pipe';
import { IsEmissionsProgram } from '../pipes/is-emissions-program.pipe';

export class MonthlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @ApiProperty({
    enum: Program,
    description: propertyMetadata.programCodeInfo.description,
  })
  @IsOptional()
  @IsEmissionsProgram({
    each: true,
    message:
      ErrorMessages.UnitCharacteristics(true, 'programCodeInfo') +
      '?emissionsUIFilter=true',
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  programCodeInfo?: Program[];

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
    description: propertyMetadata.month.description,
  })
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
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
