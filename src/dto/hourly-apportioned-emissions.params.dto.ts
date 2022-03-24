import { ApiProperty } from '@nestjs/swagger';
import { IsInEnum, IsInResponse } from '@us-epa-camd/easey-common/pipes';
import { IsOptional } from 'class-validator';

import {
  ErrorMessages,
  propertyMetadata,
} from '@us-epa-camd/easey-common/constants';
import { Transform } from 'class-transformer';
import { ExcludeHourlyApportionedEmissions } from '@us-epa-camd/easey-common/enums';

import { BeginDate, EndDate, Page, PerPage } from '../utils/validator.const';
import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { fieldMappings } from '../constants/field-mappings';

export class HourlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @ApiProperty({
    description: propertyMetadata.beginDate.description,
  })
  @BeginDate()
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.endDate.description,
  })
  @EndDate()
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.operatingHoursOnly.description,
  })
  @IsOptional()
  operatingHoursOnly?: boolean;
}

export class PaginatedHourlyApportionedEmissionsParamsDTO extends HourlyApportionedEmissionsParamsDTO {
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

export class StreamHourlyApportionedEmissionsParamsDTO extends HourlyApportionedEmissionsParamsDTO {
  @ApiProperty({
    enum: ExcludeHourlyApportionedEmissions,
    description: propertyMetadata.exclude.description,
  })
  @IsOptional()
  @IsInEnum(ExcludeHourlyApportionedEmissions, {
    each: true,
    message: ErrorMessages.RemovableParameter(),
  })
  @IsInResponse(fieldMappings.emissions.hourly, {
    each: true,
    message: ErrorMessages.ValidParameter(),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  exclude?: ExcludeHourlyApportionedEmissions[];
}
