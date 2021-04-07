import { Request } from 'express';
import { ApiTags, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { Get, Controller, Query, Req } from '@nestjs/common';

import { ApportionedEmissionsService } from './apportioned-emissions.service';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { DailyApportionedEmissionsDTO } from '../dto/daily-apportioned-emissions.dto';
import { DailyApportionedEmissionsParamsDTO } from '../dto/daily-apportioned-emissions.params.dto';
import { MonthlyApportionedEmissionsParamsDTO } from '../dto/monthly-apportioned-emissions.params.dto';
import { MonthlyApportionedEmissionsDTO } from '../dto/monthly-apportioned-emissions.dto';
import {
  BadRequestResponse,
  NotFoundResponse,
  ApiQueryMultiSelect,
} from '../utils/swagger-decorator.const';

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
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
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
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
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
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQuery({style: 'pipeDelimited', name: 'opYear', required: true, explode: false,})
  @ApiQuery({style: 'pipeDelimited', name: 'opMonth', required: true, explode: false,})
  @ApiQueryMultiSelect()
  getMonthlyEmissions(
    @Query()
    monthlyApportionedEmissionsParamsDTO: MonthlyApportionedEmissionsParamsDTO,
    @Req() req: Request,
  ): Promise<MonthlyApportionedEmissionsDTO[]> {
    return this.apportionedEmissionsService.getMonthlyEmissions(
      monthlyApportionedEmissionsParamsDTO,
      req,
    );
  }
}
