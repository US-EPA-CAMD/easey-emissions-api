import { IsDefined, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import {
  propertyMetadata,
  ErrorMessages
} from '@us-epa-camd/easey-common/constants';

import {
  IsInRange,
  Min,
} from '@us-epa-camd/easey-common/pipes';

import { OpYear } from '../utils/validator.const';
import { PAGINATION_MAX_PER_PAGE } from '../config/app.config';
import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';

export class OzoneApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @ApiProperty({
    isArray: true,
    description: propertyMetadata.year.description,
  })
  @OpYear()
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  year: number[];
}

export class PaginatedOzoneApportionedEmissionsParamsDTO extends OzoneApportionedEmissionsParamsDTO {
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
