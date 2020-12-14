import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDTO } from './pagination.dto';
import { Control } from '../enums/control.enum';
import { UnitFuelType } from '../enums/unit-fuel-type.enum';
import { UnitType } from '../enums/unit-type.enum';
import { State } from '../enums/state.enum';

export class EmissionsParamsDTO extends PaginationDTO {
  @IsOptional()
  @ApiPropertyOptional()
  beginDate: Date;

  @IsOptional()
  @ApiPropertyOptional()
  endDate: Date;

  @IsOptional()
  @ApiPropertyOptional()
  state: State;

  @IsOptional()
  @ApiPropertyOptional()
  facilityName: string;

  @IsOptional()
  @ApiPropertyOptional()
  orisCode: number;

  @IsOptional()
  @ApiPropertyOptional()
  unitType: UnitType;

  @IsOptional()
  @ApiPropertyOptional()
  unitFuelType: Array<UnitFuelType>;

  @IsOptional()
  @ApiPropertyOptional()
  controlTechnologies: Array<Control>;

  @IsOptional()
  @ApiPropertyOptional()
  opHoursOnly: boolean;
}