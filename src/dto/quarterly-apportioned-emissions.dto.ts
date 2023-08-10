import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { ApportionedEmissionsDTO } from './apportioned-emissions.dto';
import { IsNumber } from 'class-validator';

export class QuarterlyApportionedEmissionsDTO extends ApportionedEmissionsDTO {
  @ApiProperty({
    description: propertyMetadata.year.description,
    example: propertyMetadata.year.example,
    name: propertyMetadata.year.fieldLabels.value,
  })
  @IsNumber()
  year: number;

  @ApiProperty({
    description: propertyMetadata.quarter.description,
    example: propertyMetadata.quarter.example,
    name: propertyMetadata.quarter.fieldLabels.value,
  })
  @IsNumber()
  quarter: number;

  @ApiProperty({
    description: propertyMetadata.sumOpTime.description,
    example: propertyMetadata.sumOpTime.example,
    name: propertyMetadata.sumOpTime.fieldLabels.value,
  })
  @IsNumber()
  sumOpTime?: number;

  @ApiProperty({
    description: propertyMetadata.countOpTime.description,
    example: propertyMetadata.countOpTime.example,
    name: propertyMetadata.countOpTime.fieldLabels.value,
  })
  @IsNumber()
  countOpTime?: number;

  @ApiProperty({
    description: propertyMetadata.unit_id.description,
    example: propertyMetadata.unit_id.example,
    name: propertyMetadata.unit_id.fieldLabels.value,
  })
  @IsNumber()
  unit_id: number
}
