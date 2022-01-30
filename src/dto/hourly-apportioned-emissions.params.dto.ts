import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { BeginDate, EndDate } from '../utils/validator.const';
import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';

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
  page: number;

  @ApiProperty({
    description: propertyMetadata.perPage.description,
  })
  perPage: number;
}
