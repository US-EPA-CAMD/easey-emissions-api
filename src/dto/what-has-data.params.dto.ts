import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmissionsDataTypes } from '../enums/emissions-data-types.enum';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class WhatHasDataParamsDTO {
  @ApiProperty({
    enum: EmissionsDataTypes,
  })
  @IsString()
  dataType: EmissionsDataTypes;

  @ApiPropertyOptional({
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  workspace: boolean;
}

export default WhatHasDataParamsDTO;
