import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import {
  propertyMetadata,
  ErrorMessages
} from '@us-epa-camd/easey-common/constants';

import { OpYear } from '../utils/validator.const';
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
  page: number;

  @ApiProperty({
    description: propertyMetadata.perPage.description,
  })
  perPage: number;
}
