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
  BadRequestResponse,
  NotFoundResponse,
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
          $ref: getSchemaPath(MonthlyApportionedEmissionsDTO),
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
  ): Promise<MonthUnitDataView[]> {
    return this.service.getEmissions(req, params);
  }

  @Get('by-facility')
  @ApiOkResponse({
    description:
      'Retrieves Monthly Apportioned Emissions data per filter criteria aggregated by facility',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            MonthlyApportionedEmissionsFacilityAggregationDTO,
          ),
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
  getEmissionsFacilityAggregation(
    @Req() req: Request,
    @Query() params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthlyApportionedEmissionsFacilityAggregationDTO[]> {
    return this.service.getEmissionsFacilityAggregation(req, params);
  }

  @Get('by-state')
  @ApiOkResponse({
    description:
      'Retrieves Monthly Apportioned Emissions data per filter criteria aggregated by state',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(MonthlyApportionedEmissionsStateAggregationDTO),
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
  getEmissionsStateAggregation(
    @Req() req: Request,
    @Query() params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthlyApportionedEmissionsStateAggregationDTO[]> {
    return this.service.getEmissionsStateAggregation(req, params);
  }

  @Get('nationally')
  @ApiOkResponse({
    description:
      'Retrieves Monthly Apportioned Emissions data per filter criteria aggregated nationally',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            MonthlyApportionedEmissionsNationalAggregationDTO,
          ),
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
  getEmissionsNationalAggregation(
    @Req() req: Request,
    @Query() params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthlyApportionedEmissionsNationalAggregationDTO[]> {
    return this.service.getEmissionsNationalAggregation(req, params);
  }
}
