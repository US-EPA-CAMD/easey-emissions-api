import {
  Get,
  Body,
  Post,
  Query,
  UseGuards,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';

import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { EmissionsDTO, EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsWorkspaceService } from './emissions.service';
import { EmissionsChecksService } from './emissions-checks.service';
import { EmissionsReviewSubmitDTO } from '../dto/emissions-review-submit.dto';
import { ReviewAndSubmitMultipleParamsDTO } from '../dto/review-and-submit-multiple-params.dto';
import { ReviewSubmitService } from './ReviewSubmit.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiTags('Emissions')
@ApiSecurity('APIKey')
export class EmissionsWorkspaceController {
  constructor(
    private readonly service: EmissionsWorkspaceService,
    private readonly submissionService: ReviewSubmitService,
    private readonly checksService: EmissionsChecksService,
  ) {}

  @Get('export')
  @ApiOkResponse({
    description:
      'Exports emissions data for the specified Monitor Plan & Reporting Period',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @RoleGuard(
    { enforceCheckout: false, queryParam: 'monitorPlanId' },
    LookupType.MonitorPlan,
  )
  export(@Query() params: EmissionsParamsDTO): Promise<EmissionsDTO> {
    return this.service.export(params);
  }

  @Post('import')
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: EmissionsDTO,
    description: 'Imports Emissions data from JSON file into the workspace',
  })
  @RoleGuard(
    {
      importLocationSources: [
        'dailyEmissionData',
        'weeklyTestSummaryData',
        'summaryValueData',
        'dailyTestSummaryData',
        'hourlyOperatingData',
        'longTermFuelFlowData',
        'sorbentTrapData',
        'nsps4tSummaryData',
      ],
    },
    LookupType.Location,
  )
  async import(@Body() payload: EmissionsImportDTO, @User() user: CurrentUser) {
    await this.checksService.runChecks(payload);
    return this.service.import(payload, user.userId);
  }

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: EmissionsReviewSubmitDTO,
    description: 'Retrieves emissions review and submit records',
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
  @RoleGuard(
    { enforceCheckout: false, queryParam: 'orisCodes', isPipeDelimitted: true },
    LookupType.Facility,
  )
  async getEmissions(
    @Query() dto: ReviewAndSubmitMultipleParamsDTO,
  ): Promise<EmissionsReviewSubmitDTO[]> {
    return this.submissionService.getEmissionsRecords(
      dto.orisCodes,
      dto.monPlanIds,
      dto.quarters,
    );
  }
}
