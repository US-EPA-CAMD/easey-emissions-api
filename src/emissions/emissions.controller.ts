import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { EmissionsSubmissionsProgressDTO } from '../dto/emissions-submission-progress.dto';
import { EmissionService } from './emissions.service';

@Controller('emissions')
@ApiTags('Emissions')
@ApiSecurity('APIKey')
export class EmissionController {
  constructor(private readonly service: EmissionService) {}

  @Get('submission-progress')
  @ApiOkResponse({
    description: 'Retrieve submissions for current time period',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(EmissionsSubmissionsProgressDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  @ApiExtraModels(EmissionsSubmissionsProgressDTO)
  submissionProgress(
    @Query('submissionPeriod') submissionPeriod: string,
  ): Promise<EmissionsSubmissionsProgressDTO> {
    return this.service.getSubmissionProgress(submissionPeriod);
  }
}
