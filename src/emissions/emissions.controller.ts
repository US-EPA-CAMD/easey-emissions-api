import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
  refs, getSchemaPath } from '@nestjs/swagger';

import { EmissionsSubmissionsProgressDTO } from '../dto/emissions-submissions-progress.dto';
import { EmissionsSubmissionsParamsDTO } from '../dto/emissions-submissions.params.dto';
import { EmissionsService } from './emissions.service';
import { EmissionsDTO, EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { EmissionsReviewSubmitDTO } from '../dto/emissions-review-submit.dto';
import { ReviewAndSubmitMultipleParamsDTO } from '../dto/review-and-submit-multiple-params.dto';
import { ReviewSubmitService } from '../emissions-workspace/ReviewSubmit.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiTags('Emissions')
@ApiSecurity('APIKey')
@ApiExtraModels(EmissionsReviewSubmitDTO)
export class EmissionsController {
  constructor(
    private readonly service: EmissionsService,
    private readonly submissionService: ReviewSubmitService,
  ) {}

  @Get('export')
  @ApiOperation({
    summary:
      'Exports emissions data for the specified Monitor Plan & Reporting Period',
  })
  @ApiOkResponse({
    description: 'Successfull export of emissions data',
    content: {
      'application/json': {
        schema: {
          oneOf: refs(EmissionsDTO, EmissionsImportDTO),
        },
        examples: {
          fullExport: {
            summary: 'Full Export',
            description:
              'Full export of all data including database primary keys, calculated values, & audit properties',
            value: 'Reference EmissionsDTO schema for definition',
          },
          reportedValuesExport: {
            summary: 'Reported Values Export',
            description:
              'Export of reported values only matching import schema',
            value: 'Reference EmissionsImportDTO schema for definition',
          },
        },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async export(
    @Query() params: EmissionsParamsDTO,
  ): Promise<EmissionsDTO | EmissionsImportDTO> {
    const data = await this.service.export(params, params.reportedValuesOnly);
    if (Object.keys(data).length === 0) {
      throw new NotFoundException(
        'Export unsuccessful there is no data for this reporting period',
      );
    }
    return data;
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

  @Get()
  @ApiOkResponse({
    description: 'Retrieves emissions review and submit records',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(EmissionsReviewSubmitDTO) },
              },
            },
          },
        },
      }
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'orisCodes',
    required: true,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'monPlanIds',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'quarters',
    required: true,
    explode: false,
  })
  async getEmissions(
    @Query() dto: ReviewAndSubmitMultipleParamsDTO,
  ): Promise<ArrayResponse<EmissionsReviewSubmitDTO>> {
    const submissionList = await this.submissionService.getEmissionsRecords({
      orisCodes: dto.orisCodes,
      monPlanIds: dto.monPlanIds,
      quarters: dto.quarters,
      isWorkspace: false,
      earliestOnly: false, // This is not applicable in the global context
    });
    return {
      items: submissionList
    }
  }
}
