import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDTO } from './pagination.dto';
import { ControlTechnology } from '../enums/control-technology.enum';
import { UnitFuelType } from '../enums/unit-fuel-type.enum';
import { UnitType } from '../enums/unit-type.enum';
import { State } from '../enums/state.enum';

export class HourlyApportionedEmissionsParamsDTO extends PaginationDTO {
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
  controlTechnologies: Array<ControlTechnology>;

  @IsOptional()
  @ApiPropertyOptional()
  opHoursOnly: boolean;
}