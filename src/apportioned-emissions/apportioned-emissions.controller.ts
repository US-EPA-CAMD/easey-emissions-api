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
  ApiQuery,
  getSchemaPath,
  ApiExtraModels,
  ApiSecurity,
} from '@nestjs/swagger';

import {
  BadRequestResponse,
  NotFoundResponse,
  ApiQueryMultiSelect,
} from '../utils/swagger-decorator.const';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { Json2CsvInterceptor } from '@us-epa-camd/easey-common/interceptors';

import { ApportionedEmissionsService } from './apportioned-emissions.service';
import { DailyApportionedEmissionsDTO } from '../dto/daily-apportioned-emissions.dto';
import { DailyApportionedEmissionsParamsDTO } from '../dto/daily-apportioned-emissions.params.dto';
import { MonthlyApportionedEmissionsParamsDTO } from '../dto/monthly-apportioned-emissions.params.dto';
import { MonthlyApportionedEmissionsDTO } from '../dto/monthly-apportioned-emissions.dto';
import { QuarterlyApportionedEmissionsDTO } from '../dto/quarterly-apportioned-emissions.dto';
import { QuarterlyApportionedEmissionsParamsDTO } from '../dto/quarterly-apportioned-emissions.params.dto';
import { AnnualApportionedEmissionsDTO } from '../dto/annual-apportioned-emissions.dto';
import { AnnualApportionedEmissionsParamsDTO } from '../dto/annual-apportioned-emissions.params.dto';
import { OzoneApportionedEmissionsParamsDTO } from '../dto/ozone-apportioned-emissions.params.dto';
import { OzoneApportionedEmissionsDTO } from '../dto/ozone-apportioned-emissions.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Emissions')
@UseInterceptors(Json2CsvInterceptor)
export class ApportionedEmissionsController {
  constructor(
    private readonly apportionedEmissionsService: ApportionedEmissionsService,
    private readonly logger: Logger,
  ) {}

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
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'year',
    required: true,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'month',
    required: true,
    explode: false,
  })
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

  @Get('/quarterly')
  @ApiOkResponse({
    description: 'Retrieve Quarterly Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(QuarterlyApportionedEmissionsDTO),
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
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'year',
    required: true,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'quarter',
    required: true,
    explode: false,
  })
  @ApiQueryMultiSelect()
  @ApiExtraModels(QuarterlyApportionedEmissionsDTO)
  getQuarterlyEmissions(
    @Query()
    quarterlyApportionedEmissionsParamsDTO: QuarterlyApportionedEmissionsParamsDTO,
    @Req() req: Request,
  ): Promise<QuarterlyApportionedEmissionsDTO[]> {
    return this.apportionedEmissionsService.getQuarterlyEmissions(
      quarterlyApportionedEmissionsParamsDTO,
      req,
    );
  }

  @Get('/annual')
  @ApiOkResponse({
    description: 'Retrieve Annual Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(AnnualApportionedEmissionsDTO),
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
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'year',
    required: true,
    explode: false,
  })
  @ApiQueryMultiSelect()
  @ApiExtraModels(AnnualApportionedEmissionsDTO)
  getAnnualEmissions(
    @Query()
    annualApportionedEmissionsParamsDTO: AnnualApportionedEmissionsParamsDTO,
    @Req() req: Request,
  ): Promise<AnnualApportionedEmissionsDTO[]> {
    return this.apportionedEmissionsService.getAnnualEmissions(
      annualApportionedEmissionsParamsDTO,
      req,
    );
  }

  @Get('/ozone')
  @ApiOkResponse({
    description: 'Retrieve Ozone Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(OzoneApportionedEmissionsDTO),
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
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'year',
    required: true,
    explode: false,
  })
  @ApiQueryMultiSelect()
  @ApiExtraModels(OzoneApportionedEmissionsDTO)
  getOzoneEmissions(
    @Query()
    ozoneApportionedEmissionsParamsDTO: OzoneApportionedEmissionsParamsDTO,
    @Req() req: Request,
  ): Promise<OzoneApportionedEmissionsDTO[]> {
    return this.apportionedEmissionsService.getOzoneEmissions(
      ozoneApportionedEmissionsParamsDTO,
      req,
    );
  }
}
