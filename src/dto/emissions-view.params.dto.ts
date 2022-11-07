import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '@us-epa-camd/easey-common/pipes';
import {
  ErrorMessages,
  propertyMetadata,
} from '@us-epa-camd/easey-common/constants';
import { OneOrMore } from '../pipes/one-or-more.pipe';
import { IsReportingPeriodFormat } from '../pipes/is-reporting-period-format.pipe';
import { IsInReportingPeriodRange } from '../pipes/is-in-reporting-period.pipe';

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
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
  @IsReportingPeriodFormat({
    each: true,
    message: 'Year and Quarter must be specified in this format YYYY Q1',
  })
  @IsInReportingPeriodRange({
    each: true,
    message:
      'The Year and Quarter cannot be before 2009 and cannot surpass the current date',
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  reportingPeriod: string[];

  @ApiProperty({
    description:
      'Attaches a file with data in the format specified by the Accept header',
    default: false,
  })
  attachFile?: boolean;
}
