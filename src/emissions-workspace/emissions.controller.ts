import {
  Get,
  Body,
  Post,
  Query,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

import { EmissionsDTO, EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsWorkspaceService } from './emissions.service';
import { EmissionsChecksService } from './emissions-checks.service';

@Controller()
@ApiTags('Emissions')
@ApiSecurity('APIKey')
export class EmissionsWorkspaceController {
  constructor(
    private readonly service: EmissionsWorkspaceService,
    private readonly checksService: EmissionsChecksService,
  ) {}

  @Get('export')
  @ApiOkResponse({
    description:
      'Exports emissions data for the specified Monitor Plan & Reporting Period',
  })
  @UseInterceptors(ClassSerializerInterceptor)
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
