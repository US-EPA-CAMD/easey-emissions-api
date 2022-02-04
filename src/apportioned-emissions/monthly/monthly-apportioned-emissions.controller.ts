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
import { MonthlyApportionedEmissionsDTO } from '../../dto/monthly-apportioned-emissions.dto';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';
import { 
  MonthlyApportionedEmissionsParamsDTO,
  PaginatedMonthlyApportionedEmissionsParamsDTO,
} from '../../dto/monthly-apportioned-emissions.params.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Monthly Emissions')
@ApiExtraModels(MonthlyApportionedEmissionsDTO)
export class MonthlyApportionedEmissionsController {
  constructor(
    private readonly service: MonthlyApportionedEmissionsService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves Monthly Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(MonthlyApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.monthly.map(i => i.label).join(',')
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
    @Query() params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthlyApportionedEmissionsDTO[]> {
    return this.service.getEmissions(req, params);
  }  

  @Get('stream')
  @ApiOkResponse({
    description: 'Streams Monthly Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(MonthlyApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.monthly.map(i => i.label).join(',')
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  streamEmissions(
    @Req() req: Request,
    @Query() params: MonthlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissions(req, params);
  }
}
