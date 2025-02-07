import { Request } from 'express';

import { Get, Req, Query, Controller, UseInterceptors } from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  getSchemaPath,
  ApiSecurity,
  ApiExtraModels,
} from '@nestjs/swagger';

import { Json2CsvInterceptor } from '@us-epa-camd/easey-common/interceptors';

import {
  ApiQueryMultiSelect,
  ApiProgramQuery,
  ApiQueryMonthly,
} from '../../utils/swagger-decorator.const';

import { fieldMappings } from '../../constants/field-mappings';
import { MonthUnitDataView } from './../../entities/vw-month-unit-data.entity';
import { MonthlyApportionedEmissionsDTO } from '../../dto/monthly-apportioned-emissions.dto';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';
import { PaginatedMonthlyApportionedEmissionsParamsDTO } from '../../dto/monthly-apportioned-emissions.params.dto';
import { MonthlyApportionedEmissionsFacilityAggregationDTO } from '../../dto/monthly-apportioned-emissions-facility-aggregation.dto';
import { MonthlyApportionedEmissionsStateAggregationDTO } from '../../dto/monthly-apportioned-emissions-state-aggregation.dto';
import { MonthlyApportionedEmissionsNationalAggregationDTO } from '../../dto/monthly-apportioned-emissions-national-aggregation.dto';
import { BadRequestResponse, NotFoundResponse } from '@us-epa-camd/easey-common/utilities/common-swagger';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Monthly Emissions')
@ApiExtraModels(MonthlyApportionedEmissionsDTO)
@ApiExtraModels(MonthlyApportionedEmissionsFacilityAggregationDTO)
@ApiExtraModels(MonthlyApportionedEmissionsStateAggregationDTO)
@ApiExtraModels(MonthlyApportionedEmissionsNationalAggregationDTO)
export class MonthlyApportionedEmissionsController {
  constructor(private readonly service: MonthlyApportionedEmissionsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves Monthly Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
            type: 'object',
                 properties: {
                 items: {
                 type: 'array',
                 items: { $ref: getSchemaPath(MonthlyApportionedEmissionsDTO)
              },
            }
          },
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.monthly.data.aggregation.unit
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @ApiQueryMonthly()
  @ApiProgramQuery()
  @UseInterceptors(Json2CsvInterceptor)
  async getEmissions(
    @Req() req: Request,
    @Query() params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<MonthUnitDataView>> {
    const monthlyList = await this.service.getEmissions(req, params);
    return{
      items: monthlyList
    }
  }

  @Get('by-facility')
  @ApiOkResponse({
    description:
      'Retrieves Monthly Apportioned Emissions data per filter criteria aggregated by facility',
    content: {
      'application/json': {
        schema: {
          type: 'object',
                 properties: {
                 items: {
                 type: 'array',
                 items: { $ref: getSchemaPath(
                  MonthlyApportionedEmissionsFacilityAggregationDTO
                )
              },
            }
          },
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.monthly.data.aggregation.facility
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @ApiQueryMonthly()
  @ApiProgramQuery()
  @UseInterceptors(Json2CsvInterceptor)
  async getEmissionsFacilityAggregation(
    @Req() req: Request,
    @Query() params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<MonthlyApportionedEmissionsFacilityAggregationDTO>> {
    const byFacilityList = await this.service.getEmissionsFacilityAggregation(req, params);
    return {
      items : byFacilityList
    }
  }

  @Get('by-state')
  @ApiOkResponse({
    description:
      'Retrieves Monthly Apportioned Emissions data per filter criteria aggregated by state',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
          items: {
          type: 'array',
          items: { $ref: getSchemaPath(MonthlyApportionedEmissionsStateAggregationDTO)},
            }
          },
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.monthly.data.aggregation.state
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @ApiQueryMonthly()
  @ApiProgramQuery()
  @UseInterceptors(Json2CsvInterceptor)
  async getEmissionsStateAggregation(
    @Req() req: Request,
    @Query() params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<MonthlyApportionedEmissionsStateAggregationDTO>> {
    const byStateList = await this.service.getEmissionsStateAggregation(req, params);
    return{
      items: byStateList
    }
  }

  @Get('nationally')
  @ApiOkResponse({
    description:
      'Retrieves Monthly Apportioned Emissions data per filter criteria aggregated nationally',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
          items: {
          type: 'array',
          items: { $ref: getSchemaPath(
            MonthlyApportionedEmissionsNationalAggregationDTO
              )},
            }
          },
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.monthly.data.aggregation.national
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @ApiQueryMonthly()
  @ApiProgramQuery()
  @UseInterceptors(Json2CsvInterceptor)
  async getEmissionsNationalAggregation(
    @Req() req: Request,
    @Query() params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<MonthlyApportionedEmissionsNationalAggregationDTO>> {
    const nationallyList = await this.service.getEmissionsNationalAggregation(req, params);
    return {
      items: nationallyList
    }
  }
}
