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

import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsViewService } from './emissions-view.service';
import { EmissionsViewDTO } from '../dto/emissions-view.dto';
import { SetEmissionViewHeaderInterceptor } from '../inteceptors/set-emission-view-header.interceptor';
import { IsViewCode } from '../pipes/is-view-code.pipe';

@Controller()
@ApiTags('Emissions Views')
@ApiSecurity('APIKey')
export class EmissionsViewController {
  constructor(private readonly service: EmissionsViewService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    description:
      'Retrieves a list of official Emissions data views that are available',
  })
  getAvailableViews(): Promise<EmissionsViewDTO[]> {
    return this.service.getAvailableViews();
  }

  @Get(':viewCode')
  @ApiOkResponse({
    description:
      'Retrieves the specified view of official Emissions data for the provided Monitor Plan & Reporting Period',
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
    @Param('viewCode', IsViewCode) viewCode: string,
    @Req() req: Request,
    @Query() params: EmissionsViewParamsDTO,
  ) {
    return this.service.getView(viewCode, req, params);
  }
}
