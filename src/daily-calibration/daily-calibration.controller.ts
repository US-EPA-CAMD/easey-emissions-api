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

import { DailyCalibrationService } from './daily-calibration.service';

@Controller()
@ApiTags('Emissions Daily')
@ApiSecurity('APIKey')
export class DailyCalibrationController {
  
  constructor(
    private readonly service: DailyCalibrationService
  ) { }

  @Get()
  @ApiOkResponse({
    description: '',
  })
  async getDailyCalibrations(@Param('locId') monLocId: string) {
    return;
  }
}
