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
  ApiQueryAnnually,
} from '../../utils/swagger-decorator.const';

import { Json2CsvInterceptor } from '@us-epa-camd/easey-common/interceptors';

import { fieldMappings } from '../../constants/field-mappings';
import { AnnualUnitDataView } from '../../entities/vw-annual-unit-data.entity';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';
import { PaginatedAnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';
import { AnnualApportionedEmissionsFacilityAggregationDTO } from '../../dto/annual-apportioned-emissions-facility-aggregation.dto';
import { AnnualApportionedEmissionsAggregationDTO } from '../../dto/annual-apportioned-emissions-aggregation.dto';
import { AnnualApportionedEmissionsStateAggregationDTO } from '../../dto/annual-apportioned-emissions-state-aggregation.dto';
import { BadRequestResponse, NotFoundResponse } from '@us-epa-camd/easey-common/utilities/common-swagger';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Annual Emissions')
@ApiExtraModels(AnnualApportionedEmissionsAggregationDTO)
@ApiExtraModels(AnnualApportionedEmissionsFacilityAggregationDTO)
@ApiExtraModels(AnnualApportionedEmissionsStateAggregationDTO)
@ApiExtraModels(AnnualUnitDataView)
export class AnnualApportionedEmissionsController {
  constructor(private readonly service: AnnualApportionedEmissionsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves Annual Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(AnnualUnitDataView)},
            }
           },
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
  ): Promise<ArrayResponse<AnnualUnitDataView>> {
    const annualList = await this.service.getEmissions(req, params);
    return{
      items: annualList
    }
  }

  @Get('by-facility')
  @ApiOkResponse({
    description:
      'Retrieves Annual Apportioned Emissions data per filter criteria aggregated by facility',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(AnnualApportionedEmissionsFacilityAggregationDTO)},
            }
           },
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
  async getEmissionsFacilityAggregation(
    @Req() req: Request,
    @Query() params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<AnnualApportionedEmissionsFacilityAggregationDTO>> {
    const byFacilityList = await this.service.getEmissionsFacilityAggregation(req, params);
    return{
      items: byFacilityList
    }
  }

  @Get('by-state')
  @ApiOkResponse({
    description:
      'Retrieves Annual Apportioned Emissions data per filter criteria aggregated by state',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(AnnualApportionedEmissionsStateAggregationDTO)},
            }
           },
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
  async getEmissionsStateAggregation(
    @Req() req: Request,
    @Query() params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<AnnualApportionedEmissionsStateAggregationDTO>> {
    const byStateList = await this.service.getEmissionsStateAggregation(req, params);
    return{
      items: byStateList
    }
  }

  @Get('nationally')
  @ApiOkResponse({
    description:
      'Retrieves Annual Apportioned Emissions data per filter criteria aggregated nationally',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(AnnualApportionedEmissionsAggregationDTO)},
            }
           },
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
  async getEmissionsNationalAggregation(
    @Req() req: Request,
    @Query() params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<AnnualApportionedEmissionsAggregationDTO>> {
    const nationlityList = await this.service.getEmissionsNationalAggregation(req, params);
    return{
      items: nationlityList
    }
  }
}
