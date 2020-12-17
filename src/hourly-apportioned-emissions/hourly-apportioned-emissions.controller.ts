import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { Get, Controller, Query, ValidationPipe, Req } from '@nestjs/common';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { HourlyApportionedEmissionsDTO } from 'src/dto/hourly-apportioned-emissions.dto';

@ApiTags('Hourly Apportioned Emissions')
@Controller('apportioned/hourly')
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
  getHourlyEmissions(
    @Query(ValidationPipe)
    hourlyApportioedEmissionsParamsDTO: HourlyApportionedEmissionsParamsDTO,
    @Req() req: Request,
  ): Promise<HourlyApportionedEmissionsDTO[]> {
    return this.hourlyApportionedEmissionsService.getHourlyEmissions(
      hourlyApportioedEmissionsParamsDTO,
      req,
    );
  }
}
