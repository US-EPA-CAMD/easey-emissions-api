import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsInEnum, IsInResponse } from '@us-epa-camd/easey-common/pipes';

import {
  propertyMetadata,
  ErrorMessages,
} from '@us-epa-camd/easey-common/constants';
import { ExcludeApportionedEmissions } from '@us-epa-camd/easey-common/enums';

import { OpYear, Page, PerPage } from '../utils/validator.const';
import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { fieldMappings } from '../constants/field-mappings';

export class OzoneApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @ApiProperty({
    isArray: true,
    description: propertyMetadata.year.description,
  })
  @OpYear()
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  year: number[];
}

export class PaginatedOzoneApportionedEmissionsParamsDTO extends OzoneApportionedEmissionsParamsDTO {
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

export class StreamOzoneApportionedEmissionsParamsDTO extends OzoneApportionedEmissionsParamsDTO {
  @ApiProperty({
    enum: ExcludeApportionedEmissions,
    description: propertyMetadata.exclude.description,
  })
  @IsOptional()
  @IsInEnum(ExcludeApportionedEmissions, {
    each: true,
    message: ErrorMessages.RemovableParameter(),
  })
  @IsInResponse(fieldMappings.emissions.ozone.data.aggregation.unit, {
    each: true,
    message: ErrorMessages.ValidParameter(),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  exclude?: ExcludeApportionedEmissions[];
}
