import { IsDefined, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import {
  propertyMetadata,
  ErrorMessages
} from '@us-epa-camd/easey-common/constants';

import {
  IsInRange,
  Min,
} from '@us-epa-camd/easey-common/pipes';

import { BeginDate, EndDate } from '../utils/validator.const';
import { PAGINATION_MAX_PER_PAGE } from '../config/app.config';
import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';

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
  @IsNumber()
  @Min(1, {
    message: ErrorMessages.GreaterThanOrEqual('page', 1),
  })  
  page: number;

  @ApiProperty({
    description: propertyMetadata.perPage.description,
  })
  @IsDefined()
  @IsNumber()  
  @IsInRange(1, PAGINATION_MAX_PER_PAGE, {
    message: ErrorMessages.Between('perPage', 1, PAGINATION_MAX_PER_PAGE),
  })
  perPage: number;
}
