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

import { Json2CsvInterceptor } from '@us-epa-camd/easey-common/interceptors';

import {
  ApiQueryMultiSelect,
  ApiProgramQuery,
  ApiQueryQuarterly,
} from '../../utils/swagger-decorator.const';

import { fieldMappings } from '../../constants/field-mappings';
import { QuarterUnitDataView } from './../../entities/vw-quarter-unit-data.entity';
import { QuarterlyApportionedEmissionsService } from './quarterly-apportioned-emissions.service';
import { PaginatedQuarterlyApportionedEmissionsParamsDTO } from '../../dto/quarterly-apportioned-emissions.params.dto';
import { QuarterlyApportionedEmissionsFacilityAggregationDTO } from '../../dto/quarterly-apportioned-emissions-facility-aggregation.dto';
import { QuarterlyApportionedEmissionsStateAggregationDTO } from './../../dto/quarterly-apportioned-emissions-state-aggregation.dto';
import { QuarterlyApportionedEmissionsNationalAggregationDTO } from './../../dto/quarterly-apportioned-emissions-national-aggregation.dto';
import { BadRequestResponse, NotFoundResponse } from '@us-epa-camd/easey-common/utilities/common-swagger';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Quarterly Emissions')
@ApiExtraModels(QuarterlyApportionedEmissionsFacilityAggregationDTO)
@ApiExtraModels(QuarterlyApportionedEmissionsStateAggregationDTO)
@ApiExtraModels(QuarterlyApportionedEmissionsNationalAggregationDTO)
@ApiExtraModels(QuarterUnitDataView)
export class QuarterlyApportionedEmissionsController {
  constructor(private readonly service: QuarterlyApportionedEmissionsService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves Quarterly Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          type: 'object',
              properties: {
                items: {
               type: 'array',
              items: {   $ref: getSchemaPath(QuarterUnitDataView)},
            }
          },
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.quarterly.data.aggregation.unit
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @ApiQueryQuarterly()
  @ApiProgramQuery()
  @UseInterceptors(Json2CsvInterceptor)
  async getEmissions(
    @Req() req: Request,
    @Query() params: PaginatedQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<QuarterUnitDataView>> {
    const quarterlyList = await this.service.getEmissions(req, params);
    return{
      items: quarterlyList
    }
  }

  @Get('by-facility')
  @ApiOkResponse({
    description:
      'Retrieves Quarterly Apportioned Emissions data per filter criteria aggregated by facility',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            items: {
            type: 'array',
            items: {   $ref: getSchemaPath(
            QuarterlyApportionedEmissionsFacilityAggregationDTO,
              )},
            }
          },
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.quarterly.data.aggregation.facility
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
  @ApiQueryQuarterly()
  @UseInterceptors(Json2CsvInterceptor)
  async getEmissionsFacilityAggregation(
    @Req() req: Request,
    @Query() params: PaginatedQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<QuarterlyApportionedEmissionsFacilityAggregationDTO>> {
    const byFacilityList = await this.service.getEmissionsFacilityAggregation(req, params);
    return{
      items: byFacilityList
    }
  }

  @Get('by-state')
  @ApiOkResponse({
    description:
      'Retrieves Quarterly Apportioned Emissions data per filter criteria aggregated by state',
    content: {
      'application/json': {
        schema: {
        type: 'object',
          properties: {
            items: {
            type: 'array',
            items: { $ref: getSchemaPath(QuarterlyApportionedEmissionsStateAggregationDTO)},
            }
          },
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.quarterly.data.aggregation.state
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
    @Query() params: PaginatedQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<QuarterlyApportionedEmissionsStateAggregationDTO>> {
    const byStateList = await this.service.getEmissionsStateAggregation(req, params);
    return{
      items: byStateList
    }
  }

  @Get('nationally')
  @ApiOkResponse({
    description:
      'Retrieves Quarterly Apportioned Emissions data per filter criteria aggregated nationally',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            items: {
            type: 'array',
            items: {  $ref: getSchemaPath(
              QuarterlyApportionedEmissionsNationalAggregationDTO,
            )},
            }
          },
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.quarterly.data.aggregation.national
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
    @Query() params: PaginatedQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<QuarterlyApportionedEmissionsNationalAggregationDTO>> {
    const nationlityList = await this.service.getEmissionsNationalAggregation(req, params);
    return{
      items: nationlityList
    }
  }
}
