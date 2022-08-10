import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';

import {
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { DailyCalibrationWorkspaceService } from './daily-calibration.service';

@Controller()
@ApiTags('Emissions Daily')
@ApiSecurity('APIKey')
export class DailyCalibrationWorkspaceController {
  
  constructor(
    private readonly service: DailyCalibrationWorkspaceService
  ) { }

  @Get()
  @ApiOkResponse({
    description: '',
  })
  async getDailyCalibrations(@Param('locId') monLocId: string) {
    return;
  }
}
