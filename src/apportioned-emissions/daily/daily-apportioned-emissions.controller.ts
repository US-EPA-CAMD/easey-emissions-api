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
} from '../../utils/swagger-decorator.const';

import { Json2CsvInterceptor } from '@us-epa-camd/easey-common/interceptors';

import { fieldMappings } from '../../constants/field-mappings';
import { DailyApportionedEmissionsDTO } from '../../dto/daily-apportioned-emissions.dto';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';
import { 
  DailyApportionedEmissionsParamsDTO,
  PaginatedDailyApportionedEmissionsParamsDTO,
} from '../../dto/daily-apportioned-emissions.params.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Daily Emissions')
@ApiExtraModels(DailyApportionedEmissionsDTO)
export class DailyApportionedEmissionsController {
  constructor(
    private readonly service: DailyApportionedEmissionsService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves Daily Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(DailyApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.daily.map(i => i.label).join(',')
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @UseInterceptors(Json2CsvInterceptor)
  getEmissions(
    @Req() req: Request,
    @Query() params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DailyApportionedEmissionsDTO[]> {
    return this.service.getEmissions(req, params);
  }  

  @Get('stream')
  @ApiOkResponse({
    description: 'Streams Daily Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(DailyApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.daily.map(i => i.label).join(',')
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  streamEmissions(
    @Req() req: Request,
    @Query() params: DailyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissions(req, params);
  }
}
