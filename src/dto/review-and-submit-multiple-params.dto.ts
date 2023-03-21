import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

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
  quarters: string[];
}
