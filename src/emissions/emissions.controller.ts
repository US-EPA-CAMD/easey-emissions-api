import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { Get, Controller } from '@nestjs/common';
import { EmissionsService } from './emissions.service';

@ApiTags('Emissions')
@Controller('emissions/apportioned/hourly')
export class EmissionsController {
  constructor(private emissionsService: EmissionsService) {}

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
    return this.emissionsService.getHourlyEmissions();
  }
}
