import { Request } from 'express';

import { Json2CsvInterceptor } from '@us-epa-camd/easey-common/interceptors';

import {
  Get,
  Req,
  Query,
  Controller,
  UseInterceptors,
  StreamableFile,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  getSchemaPath,
  ApiSecurity,
  ApiExtraModels,
} from '@nestjs/swagger';

import {
  BadRequestResponse,
  NotFoundResponse,
  ApiQueryMultiSelect,
  ApiProgramQuery,
} from '../../utils/swagger-decorator.const';

import { fieldMappings } from '../../constants/field-mappings';
import { AnnualUnitDataView } from './../../entities/vw-annual-unit-data.entity';
import { AnnualApportionedEmissionsDTO } from '../../dto/annual-apportioned-emissions.dto';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';
import {
  AnnualApportionedEmissionsParamsDTO,
  PaginatedAnnualApportionedEmissionsParamsDTO,
} from '../../dto/annual-apportioned-emissions.params.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Annual Emissions')
@ApiExtraModels(AnnualApportionedEmissionsDTO)
export class AnnualApportionedEmissionsController {
  constructor(private readonly service: AnnualApportionedEmissionsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves Annual Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(AnnualApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.annual.map(i => i.label).join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @ApiProgramQuery()
  @UseInterceptors(Json2CsvInterceptor)
  getEmissions(
    @Req() req: Request,
    @Query() params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualUnitDataView[]> {
    return this.service.getEmissions(req, params);
  }

  @Get('stream')
  @ApiOkResponse({
    description: 'Streams Annual Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(AnnualApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.annual.map(i => i.label).join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @ApiProgramQuery()
  streamEmissions(
    @Req() req: Request,
    @Query() params: AnnualApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissions(req, params);
  }
}
