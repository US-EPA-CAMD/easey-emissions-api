import { Request } from 'express';
import {
  Controller,
  Get,
  Query,
  Param,
  UseInterceptors,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath, ApiBearerAuth } from '@nestjs/swagger';
import { Json2CsvInterceptor } from '@us-epa-camd/easey-common/interceptors';
import { AuditLog, RoleGuard } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';

import { EmissionsViewDTO } from '../dto/emissions-view.dto';
import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsViewWorkspaceService } from './emissions-view.service';
import { SetEmissionViewHeaderInterceptor } from '../inteceptors/set-emission-view-header.interceptor';
import { IsViewCode } from '../pipes/is-view-code.pipe';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiTags('Emissions Views')
@ApiSecurity('APIKey')
@ApiExcludeControllerByEnv()
@ApiExtraModels(EmissionsViewDTO)
export class EmissionsViewWorkspaceController {
  constructor(private readonly service: EmissionsViewWorkspaceService) { }

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves a list of workspace Emissions data views that are available',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(EmissionsViewDTO) },
            },
          },
        },
      },
    }
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @AuditLog({
    label: 'Retrieved list of available workspace Emissions views'
  })
  async getAvailableViews(): Promise<ArrayResponse<EmissionsViewDTO>> {
    const veiwsList = await this.service.getAvailableViews();
    return {
      items: veiwsList
    }
  }

  @Get(':viewCode')
  @ApiOkResponse({
    description:
      'Retrieves the specified view of workspace Emissions data for the provided Monitor Plan & Reporting Period',
    content: {
      'application/json': {},
      'text/csv': {},
    },
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'unitIds',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'stackPipeIds',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'reportingPeriod',
    required: true,
    explode: false,
  })
  @UseInterceptors(Json2CsvInterceptor)
  @UseInterceptors(SetEmissionViewHeaderInterceptor)
  @RoleGuard(
    {
      enforceCheckout: false,
      queryParam: 'monitorPlanId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.MonitorPlan,
  )
  @AuditLog({
    label: 'Retrieved workspace emissions view',
    requestParamsOutFields: ['viewCode'],
    requestQueryOutFields: ['monitorPlanId', 'unitIds', 'stackPipeIds', 'reportingPeriod']
  })
  getView(
    @Param('viewCode', IsViewCode) viewCode: string,
    @Req() req: Request,
    @Query() params: EmissionsViewParamsDTO,
  ) {
    return this.service.getView(viewCode, req, params);
  }
}
