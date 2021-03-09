import { Request } from 'express';
import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Get, Controller, Query, Req } from '@nestjs/common';

import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';

@ApiTags('Hourly Apportioned Emissions')
@Controller()
export class HourlyApportionedEmissionsController {
  constructor(
    private hourlyApportionedEmissionsService: HourlyApportionedEmissionsService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieved All Hourly Apportioned Emissions Data',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Request',
  })
  @ApiNotFoundResponse({
    description: 'Resource Not Found',
  })
  @ApiQuery({ style: 'pipeDelimited', name: 'state', required: false, explode: false })
  @ApiQuery({ style: 'pipeDelimited', name: 'orisCode', required: false, explode: false })
  @ApiQuery({ style: 'pipeDelimited', name: 'unitType', required: false, explode: false })
  @ApiQuery({ style: 'pipeDelimited', name: 'controlTechnologies', required: false, explode: false })
  @ApiQuery({ style: 'pipeDelimited', name: 'unitFuelType', required: false, explode: false })
  @ApiQuery({ style: 'pipeDelimited', name: 'program', required: false, explode: false })
  getHourlyEmissions(
    @Query()
    hourlyApportionedEmissionsParamsDTO: HourlyApportionedEmissionsParamsDTO,
    @Req() req: Request,
  ): Promise<HourlyApportionedEmissionsDTO[]> {
    return this.hourlyApportionedEmissionsService.getHourlyEmissions(
      hourlyApportionedEmissionsParamsDTO,
      req,
    );
  }
}
