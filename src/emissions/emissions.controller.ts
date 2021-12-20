import { Controller, Get, Param, Query} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { EmissionsSubmissionsProgressDTO } from 'src/dto/emissions-submission-progress.dto';
import { EmissionService } from './emissions.service';

@Controller('emissions')
@ApiTags('Emissions')
export class EmissionController {
    constructor(private service: EmissionService) {}

    @Get('submission-progress')
    @ApiOkResponse({
      type: String,
      description: 'Returns emissions submissions progress for given time period',
    })
    submissionProgress(
        @Query('submissionPeriod') submissionPeriod: string
    ): Promise<EmissionsSubmissionsProgressDTO> {
      return this.service.getSubmissionProgress(submissionPeriod);
    }
}
