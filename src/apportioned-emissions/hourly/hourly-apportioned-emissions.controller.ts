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
  ApiProgramQuery,
  ExcludeQuery,
} from '../../utils/swagger-decorator.const';

import { Json2CsvInterceptor } from '@us-epa-camd/easey-common/interceptors';

import { fieldMappings } from '../../constants/field-mappings';
import { HourUnitDataView } from './../../entities/vw-hour-unit-data.entity';
import { HourlyApportionedEmissionsDTO } from '../../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { HourlyApportionedEmissionsFacilityAggregationDTO } from '../../dto/hourly-apportioned-emissions-facility-aggregation.dto';
import {
  HourlyApportionedEmissionsParamsDTO,
  PaginatedHourlyApportionedEmissionsParamsDTO,
  StreamHourlyApportionedEmissionsParamsDTO,
} from '../../dto/hourly-apportioned-emissions.params.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Hourly Emissions')
@ApiExtraModels(HourlyApportionedEmissionsDTO)
@ApiExtraModels(HourlyApportionedEmissionsFacilityAggregationDTO)
export class HourlyApportionedEmissionsController {
  constructor(private readonly service: HourlyApportionedEmissionsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves Hourly Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(HourlyApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.hourly.unit
            .map(i => i.label)
            .join(','),
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
    @Query() params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<HourUnitDataView[]> {
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
          example: fieldMappings.emissions.hourly.unit
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @ApiProgramQuery()
  @ExcludeQuery()
  streamEmissions(
    @Req() req: Request,
    @Query() params: StreamHourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    try {
      return this.service.streamEmissions(req, params);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  @Get('facility')
  @ApiOkResponse({
    description:
      'Retrieves Hourly Apportioned Emissions Facility Aggregation data per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(HourlyApportionedEmissionsFacilityAggregationDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.hourly.facility
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @ApiProgramQuery()
  @UseInterceptors(Json2CsvInterceptor)
  getEmissionsFacilityAggregation(
    @Req() req: Request,
    @Query() params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<HourlyApportionedEmissionsFacilityAggregationDTO[]> {
    return this.service.getEmissionsFacilityAggregation(req, params);
  }

  @Get('facility/stream')
  @ApiOkResponse({
    description:
      'Streams Hourly Apportioned Emissions Facility Aggregation data per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(HourlyApportionedEmissionsFacilityAggregationDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.hourly.facility
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @ApiProgramQuery()
  streamEmissionsFacilityAggregation(
    @Req() req: Request,
    @Query() params: HourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    try {
      return this.service.streamEmissionsFacilityAggregation(req, params);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
