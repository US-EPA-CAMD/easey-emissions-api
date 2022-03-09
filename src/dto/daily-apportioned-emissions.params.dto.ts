import { IsDefined, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import {
  propertyMetadata,
  ErrorMessages,
} from '@us-epa-camd/easey-common/constants';

import {
  IsInEnum,
  IsInRange,
  IsInResponse,
  Min,
} from '@us-epa-camd/easey-common/pipes';
import { Transform } from 'class-transformer';
import { ExcludeApportionedEmissions } from '@us-epa-camd/easey-common/enums';

import { BeginDate, EndDate } from '../utils/validator.const';
import { PAGINATION_MAX_PER_PAGE } from '../config/app.config';
import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { fieldMappings } from '../constants/field-mappings';

export class DailyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
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
}

export class PaginatedDailyApportionedEmissionsParamsDTO extends DailyApportionedEmissionsParamsDTO {
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

export class StreamDailyApportionedEmissionsParamsDTO extends DailyApportionedEmissionsParamsDTO {
  @ApiProperty({
    enum: ExcludeApportionedEmissions,
    description: propertyMetadata.exclude.description,
  })
  @IsOptional()
  @IsInEnum(ExcludeApportionedEmissions, {
    each: true,
    message: ErrorMessages.RemovableParameter(),
  })
  @IsInResponse(fieldMappings.emissions.daily, {
    each: true,
    message: ErrorMessages.ValidParameter(),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  exclude?: ExcludeApportionedEmissions[];
}
