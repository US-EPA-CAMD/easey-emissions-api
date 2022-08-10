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
import { EmissionsDTO } from '../dto/emissions.dto';

@Controller()
@ApiTags('Emissions')
@ApiSecurity('APIKey')
export class EmissionsController {
  constructor(private readonly service: EmissionsService) {}

  @Get('export')
  @ApiOkResponse({
    description: 'Exports emissions data for the specified Monitor Plan & Reporting Period',
  })
  export(
    // TODO change to params DTO and apply validations for year and quarter
    @Query('monitorPlanId') monPlanId: string,
    @Query('year') year: number,
    @Query('quarter') quarter: number,
  ): Promise<EmissionsDTO> {
    return this.service.export(monPlanId, year, quarter);
  }

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
