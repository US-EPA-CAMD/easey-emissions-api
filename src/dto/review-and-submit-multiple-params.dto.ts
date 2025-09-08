import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInEnum } from '@us-epa-camd/easey-common/pipes';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { EmissionsRetrievalMode } from '../enums/emissions-retrieval-mode.enum';

export class ReviewAndSubmitMultipleParamsDTO {
  @ApiProperty({
    isArray: true,
    description: 'Array of oris codes',
  })
  @Transform(({ value }) =>
    value.split('|').map((item: string) => parseInt(item.trim())),
  )
  orisCodes: number[];

  @ApiProperty({
    isArray: true,
    description: 'Array of configurations',
  })
  @ApiPropertyOptional()
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  @IsOptional()
  monPlanIds: string[];

  @ApiProperty({
    isArray: true,
    description: 'Array of quarter abbreviations',
  })
  @ApiPropertyOptional()
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  @IsOptional()
  quarters: string[];

  @ApiProperty({
    description: 'Flag to indicate the mode of operation',
  })
  @ApiPropertyOptional()
  @IsInEnum(EmissionsRetrievalMode, {
    message: `Mode must be one of the following: ${Object.values(EmissionsRetrievalMode).join(', ')}`,
  })
  @IsOptional()
  mode?: EmissionsRetrievalMode;
}
