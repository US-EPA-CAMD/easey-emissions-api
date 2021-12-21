import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { EmissionsSubmissionsProgressDTO } from '../dto/emissions-submission-progress.dto';
import { EmissionService } from './emissions.service';

@Controller('emissions')
@ApiTags('Emissions')
@ApiSecurity('APIKey')
export class EmissionController {
  constructor(private readonly service: EmissionService) {}

  @Get('submission-progress')
  @ApiOkResponse({
    type: String,
    description: 'Returns emissions submissions progress for given time period',
  })
  submissionProgress(
    @Query('submissionPeriod') submissionPeriod: string,
  ): Promise<EmissionsSubmissionsProgressDTO> {
    return this.service.getSubmissionProgress(submissionPeriod);
  }
}
