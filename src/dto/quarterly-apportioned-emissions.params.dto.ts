import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { OpYear } from '../utils/validator.const';
import { ErrorMessages } from '../utils/error-messages';
import { IsValidNumber } from '../pipes/is-valid-number.pipe';
import { propertyMetadata } from '@us-epa-camd/easey-constants';
import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { IsInValidReportingQuarter } from '../pipes/is-in-valid-reporting-quarter.pipe';

export class QuarterlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @OpYear()
  @IsDefined()
  @ApiProperty({
    isArray: true,
    description: propertyMetadata.year.description
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  opYear: number[];

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.quarter.description
  })
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  @IsValidNumber(4, {
    each: true,
    message: ErrorMessages.MultipleFormat(
      'opQuarter',
      'single digit format (ex.1,2,3,4)',
    ),
  })
  @IsInValidReportingQuarter([1, 2, 3], 'opYear', {
    each: true,
    message: ErrorMessages.DateRange(
      'opQuarter',
      true,
      `a quarter between 01/01/1995 and the end of the calendar quarter, ${ErrorMessages.ReportingQuarter()}`,
    ),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  opQuarter: number[];
}
