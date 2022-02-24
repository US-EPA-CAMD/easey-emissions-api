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
  ApiQuery,
} from '@nestjs/swagger';

import { Json2CsvInterceptor } from '@us-epa-camd/easey-common/interceptors';

import {
  BadRequestResponse,
  NotFoundResponse,
  ApiQueryMultiSelect,
} from '../../utils/swagger-decorator.const';

import { fieldMappings } from '../../constants/field-mappings';
import { OzoneUnitDataView } from './../../entities/vw-ozone-unit-data.entity';
import { OzoneApportionedEmissionsDTO } from '../../dto/ozone-apportioned-emissions.dto';
import { OzoneApportionedEmissionsService } from './ozone-apportioned-emissions.service';
import {
  OzoneApportionedEmissionsParamsDTO,
  PaginatedOzoneApportionedEmissionsParamsDTO,
} from '../../dto/ozone-apportioned-emissions.params.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Ozone Emissions')
@ApiExtraModels(OzoneApportionedEmissionsDTO)
export class OzoneApportionedEmissionsController {
  constructor(private readonly service: OzoneApportionedEmissionsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves Ozone Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(OzoneApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.ozone.map(i => i.label).join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'programCodeInfo',
    required: false,
    explode: false,
  })
  @UseInterceptors(Json2CsvInterceptor)
  getEmissions(
    @Req() req: Request,
    @Query() params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneUnitDataView[]> {
    return this.service.getEmissions(req, params);
  }

  @Get('stream')
  @ApiOkResponse({
    description: 'Streams Ozone Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(OzoneApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.ozone.map(i => i.label).join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'programCodeInfo',
    required: false,
    explode: false,
  })
  streamEmissions(
    @Req() req: Request,
    @Query() params: OzoneApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissions(req, params);
  }
}
