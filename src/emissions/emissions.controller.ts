import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  refs,
} from '@nestjs/swagger';

import { EmissionsSubmissionsProgressDTO } from '../dto/emissions-submissions-progress.dto';
import { EmissionsSubmissionsParamsDTO } from '../dto/emissions-submissions.params.dto';
import { EmissionsService } from './emissions.service';
import { EmissionsDTO, EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

@Controller()
@ApiTags('Emissions')
@ApiSecurity('APIKey')
export class EmissionsController {
  constructor(private readonly service: EmissionsService) {}

  @Get('export')
  @ApiOperation({
    summary: 'Exports emissions data for the specified Monitor Plan & Reporting Period'
  })
  @ApiOkResponse({
    description: 'Successfull export of emissions data',
    content: {
      'application/json': {
        schema: {
          oneOf: refs(
            EmissionsDTO,
            EmissionsImportDTO,
          )
        },
        examples: {
          fullExport: {
            summary: 'Full Export',
            description: 'Full export of all data including database primary keys, calculated values, & audit properties',
            value: "Reference EmissionsDTO",
          },
          reportedValuesExport: {
            summary: 'Reported Values Export',
            description: 'Export of reported values only matching import schema',
            value: "Reference EmissionsImportDTO",
          }
        }
      }
    }
  })
  @UseInterceptors(ClassSerializerInterceptor)
  export(@Query() params: EmissionsParamsDTO): Promise<EmissionsDTO | EmissionsImportDTO> {
    return this.service.export(params);
  }

  @Get('export/all-values')
  @ApiOperation({
    summary: 'Exports emissions data for the specified Monitor Plan & Reporting Period'
  })
  @ApiOkResponse({
    type: EmissionsDTO,
    description: 'Successfull export of all data including database primary keys, calculated values, & audit properties',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  exportAllValues(@Query() params: EmissionsParamsDTO): Promise<EmissionsDTO | EmissionsImportDTO> {
    return this.service.export(params);
  }

  @Get('export/reported-values')
  @ApiOperation({
    summary: 'Exports emissions data for the specified Monitor Plan & Reporting Period'
  })
  @ApiOkResponse({
    type: EmissionsImportDTO,
    description: 'Successfull export of reported values only matching import schema',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  exportReportValues(@Query() params: EmissionsParamsDTO): Promise<EmissionsDTO | EmissionsImportDTO> {
    return this.service.export(params, true);
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
