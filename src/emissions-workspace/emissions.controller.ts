import {
  Get,
  Body,
  Post,
  Query,
  Controller,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';

import { EmissionsDTO, EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsWorkspaceService } from './emissions.service';

@Controller()
@ApiTags('Emissions')
@ApiSecurity('APIKey')
export class EmissionsWorkspaceController {
  constructor(private readonly service: EmissionsWorkspaceService) {}

  @Get('export')
  @ApiOkResponse({
    description: 'Exports emissions data for the specified Monitor Plan & Reporting Period',
  })
  export(
    // TODO change to params DTO and apply validations for year and quarter
    @Query('monitorPlanId') monPlanId: string,
    @Query('year') year: number,
    @Query('quarter') quarter: number,
  ): Promise<EmissionsDTO> {
    return this.service.export(monPlanId, year, quarter);
  }

  @Post('import')
  @ApiBearerAuth('Token')
  //@UseGuards(AuthGuard)
  @ApiOkResponse({
    type: EmissionsDTO,
    description:
      'Imports Emissions data from JSON file into the workspace',
  })
  ///@UseInterceptors(FormatValidationErrorsInterceptor)
  async import(
    @Body() payload: EmissionsImportDTO,
    //    @CurrentUser() userId: string,
  ) {
    const userId = 'testUser';
    //const locations = await this.checksService.runChecks(payload);
    return;// this.service.import(locations, payload, userId);
  }
}
