import { IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  Min,
  IsInRange,
  IsInEnum,
  IsInResponse,
} from '@us-epa-camd/easey-common/pipes';

import {
  ErrorMessages,
  propertyMetadata,
} from '@us-epa-camd/easey-common/constants';
import { Transform } from 'class-transformer';
import { ExcludeHourlyMatsApportionedEmissions } from '@us-epa-camd/easey-common/enums';

import { BeginDate, EndDate } from '../utils/validator.const';
import { PAGINATION_MAX_PER_PAGE } from '../config/app.config';
import { MatsApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { fieldMappings } from '../constants/field-mappings';

export class HourlyMatsApportionedEmissionsParamsDTO extends MatsApportionedEmissionsParamsDTO {
  @ApiProperty({
    description: propertyMetadata.beginDate.description,
  })
  @BeginDate(true)
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.endDate.description,
  })
  @EndDate(true)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.operatingHoursOnly.description,
  })
  @IsOptional()
  operatingHoursOnly?: boolean;
}

export class PaginatedHourlyMatsApportionedEmissionsParamsDTO extends HourlyMatsApportionedEmissionsParamsDTO {
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

export class StreamHourlyMatsApportionedEmissionsParamsDTO extends HourlyMatsApportionedEmissionsParamsDTO {
  @ApiProperty({
    enum: ExcludeHourlyMatsApportionedEmissions,
    description: propertyMetadata.exclude.description,
  })
  @IsOptional()
  @IsInEnum(ExcludeHourlyMatsApportionedEmissions, {
    each: true,
    message: ErrorMessages.RemovableParameter(),
  })
  @IsInResponse(fieldMappings.emissions.mats.hourly, {
    each: true,
    message: ErrorMessages.ValidParameter(),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  exclude?: ExcludeHourlyMatsApportionedEmissions[];
}
