import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ErrorMessages } from '../utils/error-messages';
import { PaginationDTO } from './pagination.dto';
import { ControlTechnology } from '../enums/control-technology.enum';
import { UnitFuelType } from '../enums/unit-fuel-type.enum';
import { UnitType } from '../enums/unit-type.enum';
import { State } from '../enums/state.enum';
import { Program } from '../enums/program.enum';
import { IsProgram } from '../pipes/is-program.pipe';
import { IsControlTechnology } from '../pipes/is-control-technology.pipe';
import { IsUnitFuelType } from '../pipes/is-unit-fuel-type.pipe';
import { IsOrisCode } from '../pipes/is-oris-code.pipe';
import { IsUnitType } from '../pipes/is-unit-type.pipe';
import { IsStateCode } from '../pipes/is-state-code.pipe';
import { propertyMetadata } from '../constants/property-metadata';

export class ApportionedEmissionsParamsDTO extends PaginationDTO {
  @IsOptional()
  @IsStateCode({
    each: true,
    message: ErrorMessages.UnitCharacteristics(true, 'state'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @ApiProperty({ description: propertyMetadata.state.description })
  state?: State[];

  @IsOptional()
  @IsOrisCode({
    each: true,
    message: ErrorMessages.UnitCharacteristics(true, 'orisCode'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @ApiProperty({ description: propertyMetadata.orisCode.description })
  orisCode?: number[];

  @IsOptional()
  @IsUnitType({
    each: true,
    message: ErrorMessages.UnitCharacteristics(true, 'unitType'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @ApiProperty({ description: propertyMetadata.unitType.description })
  unitType?: UnitType[];

  @IsOptional()
  @IsUnitFuelType({
    each: true,
    message: ErrorMessages.UnitCharacteristics(true, 'unitFuelType'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @ApiProperty({ description: propertyMetadata.unitFuelType.description })
  unitFuelType?: UnitFuelType[];

  @IsOptional()
  @IsControlTechnology({
    each: true,
    message: ErrorMessages.UnitCharacteristics(true, 'controlTechnologies'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @ApiProperty({ description: propertyMetadata.controlTechnologies.description })
  controlTechnologies?: ControlTechnology[];

  @IsOptional()
  @IsProgram(['MATS'], {
    each: true,
    message:
      ErrorMessages.UnitCharacteristics(true, 'program') + '?exclude=MATS',
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @ApiProperty({ description: propertyMetadata.program.description })
  program?: Program[];

  @ApiProperty({
    description: 'Attaches a file with data in the format specified by the Accept header',
    default: false,
  })
  attachFile?: boolean;
}
