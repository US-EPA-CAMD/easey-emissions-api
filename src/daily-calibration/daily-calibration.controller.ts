import { Controller, Get } from '@nestjs/common';

import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { DailyCalibrationService } from './daily-calibration.service';

@Controller()
@ApiTags('Emissions Daily')
@ApiSecurity('APIKey')
export class DailyCalibrationController {
  constructor(private readonly service: DailyCalibrationService) {}

  @Get()
  @ApiOkResponse({
    description: '',
  })
  // This will be for the view and will be location based so need params DTO for monitor location, year(s), and quarter(s)
  async getDailyCalibrations() {
    return;
  }
}
