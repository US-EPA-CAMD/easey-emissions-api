import { Request } from 'express';

import {
  Get,
  Req,
  Query,
  Controller,
  UseInterceptors,
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
  ApiQueryAnnually,
} from '../../utils/swagger-decorator.const';

import { Json2CsvInterceptor } from '@us-epa-camd/easey-common/interceptors';

import { fieldMappings } from '../../constants/field-mappings';
import { AnnualUnitDataView } from './../../entities/vw-annual-unit-data.entity';
import { AnnualApportionedEmissionsDTO } from '../../dto/annual-apportioned-emissions.dto';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';
import { PaginatedAnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';
import { AnnualApportionedEmissionsFacilityAggregationDTO } from '../../dto/annual-apportioned-emissions-facility-aggregation.dto';
import { AnnualApportionedEmissionsAggregationDTO } from '../../dto/annual-apportioned-emissions-aggregation.dto';
import { AnnualApportionedEmissionsStateAggregationDTO } from '../../dto/annual-apportioned-emissions-state-aggregation.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Annual Emissions')
@ApiExtraModels(AnnualApportionedEmissionsDTO)
@ApiExtraModels(AnnualApportionedEmissionsAggregationDTO)
@ApiExtraModels(AnnualApportionedEmissionsFacilityAggregationDTO)
@ApiExtraModels(AnnualApportionedEmissionsStateAggregationDTO)
export class AnnualApportionedEmissionsController {
  
  constructor(
    private readonly service: AnnualApportionedEmissionsService
  ) { }

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
          example: fieldMappings.emissions.annual.data.aggregation.unit
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @ApiQueryAnnually()
  @ApiProgramQuery()
  @UseInterceptors(Json2CsvInterceptor)
  async getEmissions(
    @Req() req: Request,
    @Query() params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualUnitDataView[]> {
    return this.service.getEmissions(req, params);
  }

  @Get('by-facility')
  @ApiOkResponse({
    description:
      'Retrieves Annual Apportioned Emissions data per filter criteria aggregated by facility',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(AnnualApportionedEmissionsFacilityAggregationDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.annual.data.aggregation.facility
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
  @ApiQueryAnnually()
  @UseInterceptors(Json2CsvInterceptor)
  getEmissionsFacilityAggregation(
    @Req() req: Request,
    @Query() params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualApportionedEmissionsFacilityAggregationDTO[]> {
    return this.service.getEmissionsFacilityAggregation(req, params);
  }

  @Get('by-state')
  @ApiOkResponse({
    description:
      'Retrieves Annual Apportioned Emissions data per filter criteria aggregated by state',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(AnnualApportionedEmissionsStateAggregationDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.annual.data.aggregation.state
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
  @ApiQueryAnnually()
  @UseInterceptors(Json2CsvInterceptor)
  getEmissionsStateAggregation(
    @Req() req: Request,
    @Query() params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualApportionedEmissionsStateAggregationDTO[]> {
    return this.service.getEmissionsStateAggregation(req, params);
  }

  @Get('nationally')
  @ApiOkResponse({
    description:
      'Retrieves Annual Apportioned Emissions data per filter criteria aggregated nationally',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(AnnualApportionedEmissionsAggregationDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.annual.data.aggregation.national
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
  @ApiQueryAnnually()
  @UseInterceptors(Json2CsvInterceptor)
  getEmissionsNationalAggregation(
    @Req() req: Request,
    @Query() params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualApportionedEmissionsAggregationDTO[]> {
    return this.service.getEmissionsNationalAggregation(req, params);
  }
}
