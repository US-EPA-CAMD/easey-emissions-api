import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { EmissionsDTO } from '../dto/emissions.dto';
import { EmissionsWorkspaceService } from './emissions.service';

@Controller()
@ApiTags('Emissions')
@ApiSecurity('APIKey')
export class EmissionsWorkspaceController {
  constructor(private readonly service: EmissionsWorkspaceService) {}

  @Get('export')
  @ApiOkResponse({
    description: 'Exports emissions data for the specified Monitor Plan & Reporting Period',
  })
  export(
    @Query('monitorPlanId') monPlanId: string,
    @Query('year') year: number,
    @Query('quarter') quarter: number,
  ): Promise<EmissionsDTO> {
    return this.service.export(monPlanId, year, quarter);
  }
}
