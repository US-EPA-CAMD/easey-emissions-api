import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDTO {
  @IsOptional()
  @ApiPropertyOptional()
  page: number;

  @IsOptional()
  @ApiPropertyOptional()
  perPage: number;

  @IsOptional()
  @ApiPropertyOptional()
  orderBy: string;
}
