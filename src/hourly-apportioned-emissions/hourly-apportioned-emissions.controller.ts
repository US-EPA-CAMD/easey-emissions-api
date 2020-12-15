import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { Get, Controller } from '@nestjs/common';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';

@ApiTags('Hourly Apportioned Emissions')
@Controller('apportioned/hourly')
export class HourlyApportionedEmissionsController {
  constructor(private hourlyApportionedEmissionsService: HourlyApportionedEmissionsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieved all Emissions Data',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Request',
  })
  @ApiNotFoundResponse({
    description: 'Resource Not Found',
  })
  getHourlyEmissions(): string {
    return this.hourlyApportionedEmissionsService.getHourlyEmissions();
  }
}
