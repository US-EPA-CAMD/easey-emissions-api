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
import { IsEmissionsProgram } from '../pipes/is-emissions-program.pipe';
import { IsControlTechnology } from '../pipes/is-control-technology.pipe';
import { IsUnitFuelType } from '../pipes/is-unit-fuel-type.pipe';
import { IsOrisCode } from '../pipes/is-oris-code.pipe';
import { IsUnitType } from '../pipes/is-unit-type.pipe';
import { IsStateCode } from '../pipes/is-state-code.pipe';
import { propertyMetadata } from '@us-epa-camd/easey-constants';

export class ApportionedEmissionsParamsDTO extends PaginationDTO {
  @IsOptional()
  @IsStateCode({
    each: true,
    message: ErrorMessages.UnitCharacteristics(true, 'state'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @ApiProperty({
    enum: State,
    description: propertyMetadata.state.description,
  })
  state?: State[];

  @IsOptional()
  @IsOrisCode({
    each: true,
    message: ErrorMessages.UnitCharacteristics(true, 'facilityId'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @ApiProperty({
    isArray: true,
    description: propertyMetadata.facilityId.description,
  })
  facilityId?: number[];

  @IsOptional()
  @IsUnitType({
    each: true,
    message: ErrorMessages.UnitCharacteristics(true, 'unitType'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @ApiProperty({
    enum: UnitType,
    description: propertyMetadata.unitType.description,
  })
  unitType?: UnitType[];

  @IsOptional()
  @IsUnitFuelType({
    each: true,
    message: ErrorMessages.UnitCharacteristics(true, 'unitFuelType'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  unitFuelType?: UnitFuelType[];

  @IsOptional()
  @IsControlTechnology({
    each: true,
    message: ErrorMessages.UnitCharacteristics(true, 'controlTechnologies'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  controlTechnologies?: ControlTechnology[];

  @IsOptional()
  @IsEmissionsProgram({
    each: true,
    message:
      ErrorMessages.UnitCharacteristics(true, 'program') +
      '?emissionsUIFilter=true',
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  @ApiProperty({
    enum: Program,
    description: propertyMetadata.programCodeInfo.description,
  })
  program?: Program[];

  @ApiProperty({
    description:
      'Attaches a file with data in the format specified by the Accept header',
  })
  attachFile?: boolean;
}
