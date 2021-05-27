import { Request } from 'express';
import {
  ApiTags,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { Get, Controller, Query, Req, UseInterceptors } from '@nestjs/common';

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

import { Json2CsvInterceptor } from '../interceptors/json2csv.interceptor';

@Controller()
@ApiTags('Apportioned Emissions')
@UseInterceptors(Json2CsvInterceptor)
export class ApportionedEmissionsController {
  constructor(
    private readonly apportionedEmissionsService: ApportionedEmissionsService,
  ) {}

  @Get('/hourly')
  @ApiOkResponse({
    description: 'Retrieve Hourly Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(HourlyApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @ApiExtraModels(HourlyApportionedEmissionsDTO)
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
    description: 'Retrieve Daily Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(DailyApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @ApiExtraModels(DailyApportionedEmissionsDTO)
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
    description: 'Retrieve Monthly Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(MonthlyApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQuery({style: 'pipeDelimited', name: 'opYear', required: true, explode: false,})
  @ApiQuery({style: 'pipeDelimited', name: 'opMonth', required: true, explode: false,})
  @ApiQueryMultiSelect()
  @ApiExtraModels(MonthlyApportionedEmissionsDTO)
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
