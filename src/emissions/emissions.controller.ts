import { Controller, Get, Query } from '@nestjs/common';

import {
  ApiExtraModels,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { EmissionsSubmissionsProgressDTO } from '../dto/emissions-submissions-progress.dto';
import { EmissionsSubmissionsParamsDTO } from '../dto/emissions-submissions.params.dto';
import { EmissionsService } from './emissions.service';

@Controller()
@ApiTags('Emissions')
@ApiSecurity('APIKey')
export class EmissionsController {
  constructor(private readonly service: EmissionsService) {}

  @Get('submission-progress')
  @ApiOkResponse({
    description: 'Retrieve submissions for current time period',
  })
  @ApiExtraModels(EmissionsSubmissionsProgressDTO)
  submissionProgress(
    @Query()
    submissionParamDTO: EmissionsSubmissionsParamsDTO,
  ): Promise<EmissionsSubmissionsProgressDTO> {
    return this.service.getSubmissionProgress(
      submissionParamDTO.submissionPeriod,
    );
  }
}
