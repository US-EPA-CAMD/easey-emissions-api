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

import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsViewWorkspaceService } from './emissions-view.service';
import { Json2CsvInterceptor } from '@us-epa-camd/easey-common/interceptors';
import { SetEmissionViewHeaderInterceptor } from '../inteceptors/set-emission-view-header.interceptor';

@Controller()
@ApiTags('Emissions')
@ApiSecurity('APIKey')
export class EmissionsViewWorkspaceController {
  constructor(private readonly service: EmissionsViewWorkspaceService) {}

  @Get(':viewCode')
  @ApiOkResponse({
    description:
      'Retrieves the specified view of Emissions data for the provided Monitor Plan & Reporting Period',
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
  getView(
    @Param('viewCode') viewCode: string,
    @Req() req: Request,
    @Query() params: EmissionsViewParamsDTO,
  ) {
    return this.service.getView(viewCode, req, params);
  }
}
