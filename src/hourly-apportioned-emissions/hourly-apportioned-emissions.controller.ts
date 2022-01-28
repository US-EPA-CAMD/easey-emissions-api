import { Request } from 'express';

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
} from '../utils/swagger-decorator.const';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { Json2CsvInterceptor } from '@us-epa-camd/easey-common/interceptors';

import { fieldMappings } from './../constants/field-mappings';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Hourly Emissions')
@ApiExtraModels(HourlyApportionedEmissionsDTO)
export class HourlyApportionedEmissionsController {
  constructor(
    private readonly service: HourlyApportionedEmissionsService,
    private readonly logger: Logger,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieve Hourly Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(HourlyApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.hourly.map(i => i.label).join(',')
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @UseInterceptors(Json2CsvInterceptor)
  getHourlyEmissions(
    @Req() req: Request,
    @Query() params: HourlyApportionedEmissionsParamsDTO,
  ): Promise<HourlyApportionedEmissionsDTO[]> {
    return this.service.getEmissions(req, params);
  }  

  @Get('stream')
  @ApiOkResponse({
    description: 'Streams Hourly Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(HourlyApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.hourly.map(i => i.label).join(',')
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  streamEmissions(
    @Req() req: Request,
    @Query() params: HourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissions(req, params);
  }
}
