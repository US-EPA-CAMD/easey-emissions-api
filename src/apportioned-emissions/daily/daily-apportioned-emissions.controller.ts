import { Request } from 'express';

import { Get, Req, Query, Controller, UseInterceptors } from '@nestjs/common';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

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
} from '../../utils/swagger-decorator.const';

import { Json2CsvInterceptor } from '@us-epa-camd/easey-common/interceptors';

import { fieldMappings } from '../../constants/field-mappings';
import { DayUnitDataView } from './../../entities/vw-day-unit-data.entity';
import { DailyApportionedEmissionsDTO } from '../../dto/daily-apportioned-emissions.dto';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';
import { PaginatedDailyApportionedEmissionsParamsDTO } from '../../dto/daily-apportioned-emissions.params.dto';
import { DailyApportionedEmissionsFacilityAggregationDTO } from '../../dto/daily-apportioned-emissions-facility-aggregation.dto';
import { DailyApportionedEmissionsStateAggregationDTO } from '../../dto/daily-apportioned-emissions-state-aggregation.dto';
import { DailyApportionedEmissionsNationalAggregationDTO } from '../../dto/daily-apportioned-emissions-national-aggregation.dto';
import { BadRequestResponse, NotFoundResponse } from '@us-epa-camd/easey-common/utilities/common-swagger';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Daily Emissions')
@ApiExtraModels(DailyApportionedEmissionsDTO)
@ApiExtraModels(DailyApportionedEmissionsFacilityAggregationDTO)
@ApiExtraModels(DailyApportionedEmissionsStateAggregationDTO)
@ApiExtraModels(DailyApportionedEmissionsNationalAggregationDTO)
export class DailyApportionedEmissionsController {
  constructor(private readonly service: DailyApportionedEmissionsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves Daily Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
         type: 'object',
            properties: {
              items: {
              type: 'array',
              items: { $ref: getSchemaPath(DailyApportionedEmissionsDTO)},
            }
          },
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.daily.data.aggregation.unit
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
  async getEmissions(
    @Req() req: Request,
    @Query() params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<DayUnitDataView>> {
    const dailyList = await this.service.getEmissions(req, params);
    return{
      items: dailyList
    }
  }

  @Get('by-facility')
  @ApiOkResponse({
    description:
      'Retrieves Daily Apportioned Emissions data per filter criteria aggregated by facility',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            items: {
            type: 'array',
            items: { $ref: getSchemaPath(DailyApportionedEmissionsFacilityAggregationDTO)},
          }
        },
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.daily.data.aggregation.facility
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
  async getEmissionsFacilityAggregation(
    @Req() req: Request,
    @Query() params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<DailyApportionedEmissionsFacilityAggregationDTO>> {
    const byFacilityList = await this.service.getEmissionsFacilityAggregation(req, params);
    return{
      items: byFacilityList
    }
  }

  @Get('by-state')
  @ApiOkResponse({
    description:
      'Retrieves Daily Apportioned Emissions data per filter criteria aggregated by state',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            items: {
            type: 'array',
            items: { $ref: getSchemaPath(DailyApportionedEmissionsStateAggregationDTO)},
          }
        },
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.daily.data.aggregation.state
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
  async getEmissionsStateAggregation(
    @Req() req: Request,
    @Query() params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<DailyApportionedEmissionsStateAggregationDTO>> {
    const byStateList = await this.service.getEmissionsStateAggregation(req, params);
    return{
      items: byStateList
    }
  }

  @Get('nationally')
  @ApiOkResponse({
    description:
      'Retrieves Daily Apportioned Emissions data per filter criteria aggregated nationally',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            items: {
            type: 'array',
            items: { $ref: getSchemaPath(DailyApportionedEmissionsNationalAggregationDTO)},
          }
        },
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.daily.data.aggregation.national
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
  async getEmissionsNationalAggregation(
    @Req() req: Request,
    @Query() params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<DailyApportionedEmissionsNationalAggregationDTO>> {
    const nationlityList = await this.service.getEmissionsNationalAggregation(req, params);
    return{
      items: nationlityList
    }
  }
}
