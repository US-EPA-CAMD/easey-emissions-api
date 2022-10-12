import { Controller, Get, Query, Param } from '@nestjs/common';

import { ApiOkResponse, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { EmissionsViewDTO } from '../dto/emissions-view.dto';
import { EmissionsViewResultsDTO } from '../dto/emissions-view-results.dto';
import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsViewService } from './emissions-view.service';

@Controller()
@ApiTags('Emissions')
@ApiSecurity('APIKey')
export class EmissionsViewController {
  constructor(private readonly service: EmissionsViewService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    description: 'Retrieves a list of Emissions data views that are available',
  })
  getAvailableViews(): Promise<EmissionsViewDTO[]> {
    return this.service.getAvailableViews();
  }

  @Get(':viewCode')
  @ApiOkResponse({
    description:
      'Retrieves the specified view of Emissions data for the provided Monitor Plan & Reporting Period',
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
  getView(
    @Param('viewCode') viewCode: string,
    @Query() params: EmissionsViewParamsDTO,
  ): Promise<EmissionsViewResultsDTO> {
    return this.service.getView(viewCode, params);
  }
}
