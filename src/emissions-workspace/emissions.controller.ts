import {
  Get,
  Body,
  Post,
  Query,
  Controller,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { ClientTokenGuard } from '@us-epa-camd/easey-common/guards';

import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiSecurity,
  ApiQuery,
  ApiOperation,
  refs, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { EmissionsDTO, EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsWorkspaceService } from './emissions.service';
import { EmissionsChecksService } from './emissions-checks.service';
import { EmissionsReviewDTO } from '../dto/emissions-review.dto';
import { ReviewAndSubmitMultipleParamsDTO } from '../dto/review-and-submit-multiple-params.dto';
import { ReviewSubmitService } from './ReviewSubmit.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';

@Controller()
@ApiTags('Emissions')
@ApiSecurity('APIKey')
@ApiExcludeControllerByEnv()
@ApiExtraModels(EmissionsReviewDTO)
export class EmissionsWorkspaceController {
  constructor(
    private readonly service: EmissionsWorkspaceService,
    private readonly submissionService: ReviewSubmitService,
    private readonly checksService: EmissionsChecksService,
  ) { }

  @Post('import-historical')
  @ApiBearerAuth('Token')
  @ApiOperation({
    summary: 'Imports historical emissions data directly into the workspace.',
  })
  @ApiOkResponse({
    type: EmissionsDTO,
    description: 'Successfully imported historical emissions data.',
  })
  @RoleGuard(
    {
      queryParam: 'monitorPlanId',
      enforceCheckout: true,
      permissionsForFacility: ['DSEM'],
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
    },
    LookupType.MonitorPlan,
  )
  @AuditLog({
    label: 'Imported historical emissions data',
    requestQueryOutFields: ['monitorPlanId', 'year', 'quarter']
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async importFromHistorical(
    @Query() params: EmissionsParamsDTO,
    @User() user: CurrentUser,
  ) { 
    return this.service.importFromHistoricalData(params, user);
  }

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
  @RoleGuard(
    {
      enforceCheckout: false,
      queryParam: 'monitorPlanId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.MonitorPlan,
  )
  @AuditLog({
    label: 'Exported emissions data for the specified Monitor Plan & Reporting Period',
    requestQueryOutFields: ['monitorPlanId', 'year', 'quarter']
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
      permissionsForFacility: ['DSEM'],
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Imported emissions data',
    requestBodyOutFields: ['orisCode', 'year', 'quarter']
  })
  async import(@Body() payload: EmissionsImportDTO, @User() user: CurrentUser) {
    await this.checksService.runChecks(payload);
    return this.service.import(payload, user.userId);
  }

  @Post('import/bulk')
  @ApiBearerAuth('ClientToken')
  @ApiSecurity('ClientId')
  @UseGuards(ClientTokenGuard)
  @ApiOkResponse({
    type: EmissionsDTO,
    description:
      'Imports Emissions data on behalf of a user for the bulk import job',
  })
  @AuditLog({
    label: 'Imported emissions data on behalf of a user for the bulk import job',
    requestBodyOutFields: ['orisCode', 'year', 'quarter']
  })
  async importBulk(
    @Body() payload: EmissionsImportDTO,
    @Query('userId') userId: string,
  ) {
    await this.checksService.runChecks(payload);
    return this.service.import(payload, userId);
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
                items: { $ref: getSchemaPath(EmissionsReviewDTO) },
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
    required: false,
    explode: false,
  })
  @ApiQuery({
    name: 'mode',
    required: false,
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      queryParam: 'orisCodes',
      isPipeDelimitted: true,
      enforceEvalSubmitCheck: false,
    },
    LookupType.Facility,
  )
  @AuditLog({
    label: 'Retrieved workspace emissions review and submit records',
    requestQueryOutFields: ['orisCodes', 'monPlanIds', 'quarters', 'mode']
  })
  async getEmissions(
    @Query() dto: ReviewAndSubmitMultipleParamsDTO,
  ): Promise<ArrayResponse<EmissionsReviewDTO>> {
    const emissionList = await this.submissionService.getEmissionsRecords({
      orisCodes: dto.orisCodes,
      monPlanIds: dto.monPlanIds,
      quarters: dto.quarters,
      isWorkspace: true,
      mode: dto.mode,
    });

    return {
      items: emissionList
    }
  }
}
