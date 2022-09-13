import { Get, Body, Post, Query, Controller } from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

import { EmissionsDTO, EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsWorkspaceService } from './emissions.service';
import { EmissionsChecksService } from './emissions-checks.service';
import { EmissionsViewDTO } from '../dto/emissions-view.dto';
import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';

@Controller()
@ApiTags('Emissions')
@ApiSecurity('APIKey')
export class EmissionsWorkspaceController {
  constructor(
    private readonly service: EmissionsWorkspaceService,
    private readonly checksService: EmissionsChecksService,
  ) {}

  @Get()
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
  getView(@Query() params: EmissionsViewParamsDTO): Promise<EmissionsViewDTO> {
    return this.service.getView(params);
  }

  @Get('export')
  @ApiOkResponse({
    description:
      'Exports emissions data for the specified Monitor Plan & Reporting Period',
  })
  export(@Query() params: EmissionsParamsDTO): Promise<EmissionsDTO> {
    return this.service.export(params);
  }

  @Post('import')
  @ApiBearerAuth('Token')
  //@UseGuards(AuthGuard)
  @ApiOkResponse({
    type: EmissionsDTO,
    description: 'Imports Emissions data from JSON file into the workspace',
  })
  ///@UseInterceptors(FormatValidationErrorsInterceptor)
  async import(
    @Body() payload: EmissionsImportDTO,
    //    @CurrentUser() userId: string,
  ) {
    const userId = 'testUser';
    await this.checksService.runChecks(payload);
    return this.service.import(payload);
  }
}
