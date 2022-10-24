import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmptyString,
  IsValidNumber,
  IsYearFormat,
} from '@us-epa-camd/easey-common/pipes';
import {
  ErrorMessages,
  propertyMetadata,
} from '@us-epa-camd/easey-common/constants';
import { OneOrMore } from '../pipes/one-or-more.pipe';
import { IsInYearAndQuarterRange } from '../pipes/is-in-year-and-quarter-range.pipe';

export class EmissionsViewParamsDTO {
  @ApiProperty()
  monitorPlanId: string;

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.unitId.description,
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  unitIds?: string[];

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.stackPipeId.description,
  })
  @OneOrMore('unitIds', {
    message: 'At least one Unit or Stack Pipe identifier is required',
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  stackPipeIds?: string[];

  @ApiProperty({
    isArray: true,
  })
  @IsYearFormat({
    each: true,
    message: ErrorMessages.SingleFormat('year', 'YYYY format'),
  })
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
  @IsInYearAndQuarterRange('quarter', {
    message:
      'The Year and Quarter cannot be before 2009 and cannot surpass the current date',
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  year: number[];

  @ApiProperty({
    isArray: true,
  })
  @IsValidNumber(4, {
    each: true,
    message: ErrorMessages.SingleFormat(
      'quarter',
      'single digit format (ex.1,2,3,4)',
    ),
  })
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  quarter: number[];

  @ApiProperty({
    description:
      'Attaches a file with data in the format specified by the Accept header',
    default: false,
  })
  attachFile?: boolean;
}
