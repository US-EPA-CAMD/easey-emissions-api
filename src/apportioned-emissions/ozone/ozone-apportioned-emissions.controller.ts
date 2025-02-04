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
  ApiQueryAnnually,
} from '../../utils/swagger-decorator.const';

import { fieldMappings } from '../../constants/field-mappings';
import { OzoneUnitDataView } from './../../entities/vw-ozone-unit-data.entity';
import { OzoneApportionedEmissionsDTO } from '../../dto/ozone-apportioned-emissions.dto';
import { OzoneApportionedEmissionsService } from './ozone-apportioned-emissions.service';
import { PaginatedOzoneApportionedEmissionsParamsDTO } from '../../dto/ozone-apportioned-emissions.params.dto';
import { OzoneApportionedEmissionsFacilityAggregationDTO } from './../../dto/ozone-apportioned-emissions-facility-aggregation.dto';
import { OzoneApportionedEmissionsStateAggregationDTO } from './../../dto/ozone-apportioned-emissions-state-aggregation.dto';
import { OzoneApportionedEmissionsNationalAggregationDTO } from './../../dto/ozone-apportioned-emissions-national-aggregation.dto';
import { BadRequestResponse, NotFoundResponse } from '@us-epa-camd/easey-common/utilities/common-swagger';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Ozone Emissions')
@ApiExtraModels(OzoneApportionedEmissionsDTO)
@ApiExtraModels(OzoneApportionedEmissionsFacilityAggregationDTO)
@ApiExtraModels(OzoneApportionedEmissionsStateAggregationDTO)
@ApiExtraModels(OzoneApportionedEmissionsNationalAggregationDTO)
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
          example: fieldMappings.emissions.ozone.data.aggregation.unit
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
    @Query() params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<OzoneUnitDataView>> {
    const ozoneList = await this.service.getEmissions(req, params);
    return {
      items:ozoneList
    }
  }

  @Get('by-facility')
  @ApiOkResponse({
    description:
      'Retrieves Ozone Apportioned Emissions per filter criteria aggregated by facility',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(OzoneApportionedEmissionsFacilityAggregationDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.ozone.data.aggregation.facility
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
  async getEmissionsFacilityAggregation(
    @Req() req: Request,
    @Query() params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<OzoneApportionedEmissionsFacilityAggregationDTO>> {
    const byFacilityList =  await this.service.getEmissionsFacilityAggregation(req, params);
    return{
      items:byFacilityList
    }
  }

  @Get('by-state')
  @ApiOkResponse({
    description:
      'Retrieves Ozone Apportioned Emissions per filter criteria aggregated by state',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(OzoneApportionedEmissionsStateAggregationDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.ozone.data.aggregation.state
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
  async getEmissionsStateAggregation(
    @Req() req: Request,
    @Query() params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<OzoneApportionedEmissionsStateAggregationDTO>> {
    const byStateList = await this.service.getEmissionsStateAggregation(req, params);
    return{
      items:byStateList
    }
  }

  @Get('nationally')
  @ApiOkResponse({
    description:
      'Retrieves Ozone Apportioned Emissions per filter criteria aggregated nationally',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(OzoneApportionedEmissionsNationalAggregationDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.ozone.data.aggregation.national
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
  async getEmissionsNationalAggregation(
    @Req() req: Request,
    @Query() params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<OzoneApportionedEmissionsNationalAggregationDTO>> {
    const nationlityList = await this.service.getEmissionsNationalAggregation(req, params);
    return{
      items:nationlityList
    }
  }
}
