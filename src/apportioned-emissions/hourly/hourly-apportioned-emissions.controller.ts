import { Request } from 'express';

import { Get, Req, Query, Controller, UseInterceptors } from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  getSchemaPath,
  ApiSecurity,
  ApiExtraModels,
} from '@nestjs/swagger';

import {
  ApiQueryMultiSelect,
  ApiProgramQuery,
  ApiLocationNameQuery,
} from '../../utils/swagger-decorator.const';

import { Json2CsvInterceptor } from '@us-epa-camd/easey-common/interceptors';

import { fieldMappings } from '../../constants/field-mappings';
import { HourUnitDataView } from './../../entities/vw-hour-unit-data.entity';
import { HourlyApportionedEmissionsDTO } from '../../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { PaginatedHourlyApportionedEmissionsParamsDTO } from '../../dto/hourly-apportioned-emissions.params.dto';
import { HourlyApportionedEmissionsFacilityAggregationDTO } from '../../dto/hourly-apportioned-emissions-facility-aggregation.dto';
import { HourlyApportionedEmissionsStateAggregationDTO } from '../../dto/hourly-apportioned-emissions-state-aggregation.dto';
import { HourlyApportionedEmissionsNationalAggregationDTO } from '../../dto/hourly-apportioned-emissions-national-aggregation.dto';
import { BadRequestResponse, NotFoundResponse } from '@us-epa-camd/easey-common/utilities/common-swagger';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Hourly Emissions')
@ApiExtraModels(HourlyApportionedEmissionsDTO)
@ApiExtraModels(HourlyApportionedEmissionsFacilityAggregationDTO)
@ApiExtraModels(HourlyApportionedEmissionsStateAggregationDTO)
@ApiExtraModels(HourlyApportionedEmissionsNationalAggregationDTO)
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
          example: fieldMappings.emissions.hourly.data.aggregation.unit
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
  @ApiLocationNameQuery()
  @UseInterceptors(Json2CsvInterceptor)
  async getEmissions(
    @Req() req: Request,
    @Query() params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<HourUnitDataView>> {
    const hourlyList = await this.service.getEmissions(req, params);
    return {
      items: hourlyList
    }
  }

  @Get('by-facility')
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
          example: fieldMappings.emissions.hourly.data.aggregation.facility
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
  @ApiLocationNameQuery()
  @UseInterceptors(Json2CsvInterceptor)
  async getEmissionsFacilityAggregation(
    @Req() req: Request,
    @Query() params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<HourlyApportionedEmissionsFacilityAggregationDTO>> {
    const byFacilityList = await this.service.getEmissionsFacilityAggregation(req, params);
    return{
      items: byFacilityList
    }
  }

  @Get('by-state')
  @ApiOkResponse({
    description:
      'Retrieves Hourly Apportioned Emissions data per filter criteria aggregated by state',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(HourlyApportionedEmissionsStateAggregationDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.hourly.data.aggregation.state
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
  @ApiLocationNameQuery()
  @UseInterceptors(Json2CsvInterceptor)
  async getEmissionsStateAggregation(
    @Req() req: Request,
    @Query() params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<HourlyApportionedEmissionsStateAggregationDTO>> {
    const byStateList = await this.service.getEmissionsStateAggregation(req, params);
    return{
      items: byStateList
    }
  }

  @Get('nationally')
  @ApiOkResponse({
    description:
      'Retrieves Hourly Apportioned Emissions data per filter criteria aggregated nationally',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(HourlyApportionedEmissionsNationalAggregationDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.hourly.data.aggregation.national
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
  @ApiLocationNameQuery()
  @UseInterceptors(Json2CsvInterceptor)
  async getEmissionsNationalAggregation(
    @Req() req: Request,
    @Query() params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<HourlyApportionedEmissionsNationalAggregationDTO>> {
    const nationallyList = await this.service.getEmissionsNationalAggregation(req, params);
    return{
      items: nationallyList
    }
  }
}
