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
import { ApportionedEmissionsParamsDTO } from '../dto/apportioned-emissions.params.dto';
import { ApportionedEmissionsService } from './apportioned-emissions.service';

@ApiTags('Apportioned Emissions')
@Controller()
export class ApportionedEmissionsController {
  constructor(
    private readonly apportionedEmissionsService: ApportionedEmissionsService,
  ) {}

  @Get('/hourly')
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
    return this.apportionedEmissionsService.getHourlyEmissions(
      hourlyApportionedEmissionsParamsDTO,
      req,
    );
  }

  @Get('/daily')
  @ApiOkResponse({
    description: 'Retrieved All Daily Apportioned Emissions Data',
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
  getDailyEmissions(
    @Query()
    apportionedEmissionsParamsDTO: ApportionedEmissionsParamsDTO,
    @Req() req: Request,
  ): string {
    return this.apportionedEmissionsService.getDailyEmissions(
      apportionedEmissionsParamsDTO,
      req,
    );
  }
}
