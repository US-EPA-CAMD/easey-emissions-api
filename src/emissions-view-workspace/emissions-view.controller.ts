import { Request } from 'express';
import {
  Controller,
  Get,
  Query,
  Param,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Json2CsvInterceptor } from '@us-epa-camd/easey-common/interceptors';
import { RoleGuard } from '@us-epa-camd/easey-common/decorators';

import { EmissionsViewDTO } from '../dto/emissions-view.dto';
import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsViewWorkspaceService } from './emissions-view.service';
import { SetEmissionViewHeaderInterceptor } from '../inteceptors/set-emission-view-header.interceptor';
import { IsViewCode } from '../pipes/is-view-code.pipe';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiTags('Emissions Views')
@ApiSecurity('APIKey')
export class EmissionsViewWorkspaceController {
  constructor(private readonly service: EmissionsViewWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    description:
      'Retrieves a list of workspace Emissions data views that are available',
  })
  getAvailableViews(): Promise<EmissionsViewDTO[]> {
    return this.service.getAvailableViews();
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
  getView(
    @Param('viewCode', IsViewCode) viewCode: string,
    @Req() req: Request,
    @Query() params: EmissionsViewParamsDTO,
  ) {
    return this.service.getView(viewCode, req, params);
  }
}
