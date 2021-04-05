import { Request } from 'express';
import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Get, Controller, Query, Req } from '@nestjs/common';

import { ApportionedEmissionsService } from './apportioned-emissions.service';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { DailyApportionedEmissionsDTO } from '../dto/daily-apportioned-emissions.dto';
import { DailyApportionedEmissionsParamsDTO } from '../dto/daily-apportioned-emissions.params.dto';
import { MonthlyApportionedEmissionsParamsDTO } from '../dto/monthly-apportioned-emissions.params.dto';
import { SwaggerDecorators } from '../utils/swagger-decorator.const';

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
    description: SwaggerDecorators.badRequestResponse,
  })
  @ApiNotFoundResponse({
    description: SwaggerDecorators.notFoundResponse,
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
    description: SwaggerDecorators.badRequestResponse,
  })
  @ApiNotFoundResponse({
    description: SwaggerDecorators.notFoundResponse,
  })
  @ApiQuery({ style: 'pipeDelimited', name: 'state', required: false, explode: false })
  @ApiQuery({ style: 'pipeDelimited', name: 'orisCode', required: false, explode: false })
  @ApiQuery({ style: 'pipeDelimited', name: 'unitType', required: false, explode: false })
  @ApiQuery({ style: 'pipeDelimited', name: 'controlTechnologies', required: false, explode: false })
  @ApiQuery({ style: 'pipeDelimited', name: 'unitFuelType', required: false, explode: false })
  @ApiQuery({ style: 'pipeDelimited', name: 'program', required: false, explode: false })
  getDailyEmissions(
    @Query()
    dailyApportionedEmissionsParamsDTO: DailyApportionedEmissionsParamsDTO,
    @Req() req: Request,
  ): Promise<DailyApportionedEmissionsDTO[]> {
    return this.apportionedEmissionsService.getDailyEmissions(
      dailyApportionedEmissionsParamsDTO,
      req,
    );
  }

  @Get('/monthly')
  @ApiOkResponse({
    description: 'Retrieved All Monthly Apportioned Emissions Data',
  })
  @ApiBadRequestResponse({
    description: SwaggerDecorators.badRequestResponse,
  })
  @ApiNotFoundResponse({
    description: SwaggerDecorators.notFoundResponse,
  })
  @ApiQuery({ style: 'pipeDelimited', name: 'state', required: false, explode: false })
  @ApiQuery({ style: 'pipeDelimited', name: 'orisCode', required: false, explode: false })
  @ApiQuery({ style: 'pipeDelimited', name: 'unitType', required: false, explode: false })
  @ApiQuery({ style: 'pipeDelimited', name: 'controlTechnologies', required: false, explode: false })
  @ApiQuery({ style: 'pipeDelimited', name: 'unitFuelType', required: false, explode: false })
  @ApiQuery({ style: 'pipeDelimited', name: 'program', required: false, explode: false })
  getMonthlyEmissions(
    @Query()
    monthlyApportionedEmissionsParamsDTO: MonthlyApportionedEmissionsParamsDTO,
    @Req() req: Request,
  ): string {
    return this.apportionedEmissionsService.getMonthlyEmissions(
      monthlyApportionedEmissionsParamsDTO,
      req,
    );
  }
}
