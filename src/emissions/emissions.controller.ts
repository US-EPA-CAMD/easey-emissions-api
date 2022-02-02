import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { EmissionsSubmissionsParamsDTO } from '../dto/emissions-submissions.params.dto';
import { EmissionService } from './emissions.service';
import { EmissionsSubmissionsResponseDTO } from '../dto/emissions-submissions-response.dto';

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
          $ref: getSchemaPath(EmissionsSubmissionsResponseDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  @ApiExtraModels(EmissionsSubmissionsResponseDTO)
  submissionProgress(
    @Query()
    submissionParamDTO: EmissionsSubmissionsParamsDTO,
  ): Promise<EmissionsSubmissionsResponseDTO> {
    return this.service.getSubmissionProgress(
      submissionParamDTO.submissionPeriod,
    );
  }
}
