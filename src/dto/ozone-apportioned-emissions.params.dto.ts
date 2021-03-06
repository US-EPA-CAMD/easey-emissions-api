import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-constants';

import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { ErrorMessages } from '../utils/error-messages';
import { OpYear } from '../utils/validator.const';

export class OzoneApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @ApiProperty({
    isArray: true,
    description: propertyMetadata.year.description,
  })
  @OpYear()
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  opYear: number[];
}
