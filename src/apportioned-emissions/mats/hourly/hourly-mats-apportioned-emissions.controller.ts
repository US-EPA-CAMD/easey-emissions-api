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
} from '../../../utils/swagger-decorator.const';

import { fieldMappings } from '../../../constants/field-mappings';
import { HourlyMatsApportionedEmissionsDTO } from '../../../dto/hourly-mats-apportioned-emissions.dto';
import { HourlyMatsApportionedEmissionsService } from './hourly-mats-apportioned-emissions.service';
import { PaginatedHourlyMatsApportionedEmissionsParamsDTO } from '../../../dto/hourly-mats-apporitioned-emissions.params.dto';
import { HourUnitMatsDataView } from '../../../entities/vw-hour-unit-mats-data.entity';
import { BadRequestResponse, NotFoundResponse } from '@us-epa-camd/easey-common/utilities/common-swagger';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Hourly MATS Emissions')
@ApiExtraModels(HourlyMatsApportionedEmissionsDTO)
export class HourlyMatsApportionedEmissionsController {
  constructor(
    private readonly service: HourlyMatsApportionedEmissionsService,
  ) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves Hourly MATS Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(HourlyMatsApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.mats.hourly.data.aggregation.unit
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @UseInterceptors(Json2CsvInterceptor)
  async getEmissions(
    @Req() req: Request,
    @Query() params: PaginatedHourlyMatsApportionedEmissionsParamsDTO,
  ): Promise<ArrayResponse<HourUnitMatsDataView>> {
    const hourlyList = await this.service.getEmissions(req, params);
    return{
      items: hourlyList
    }
  }

  // @Get()
  // @ApiOkResponse({
  //   description:
  //     'Streams Hourly MATS Apportioned Emissions per filter criteria',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         $ref: getSchemaPath(HourlyMatsApportionedEmissionsDTO),
  //       },
  //     },
  //     'text/csv': {
  //       schema: {
  //         type: 'string',
  //         example: fieldMappings.emissions.mats.hourly.data.aggregation.unit
  //           .map(i => i.label)
  //           .join(','),
  //       },
  //     },
  //   },
  // })
  // @BadRequestResponse()
  // @NotFoundResponse()
  // @ApiQueryMultiSelect()
  // @ExcludeQuery()
  // streamEmissions(
  //   @Req() req: Request,
  //   @Query() params: StreamHourlyMatsApportionedEmissionsParamsDTO,
  // ): Promise<StreamableFile> {
  //   return this.service.streamEmissions(req, params);
  // }
}
