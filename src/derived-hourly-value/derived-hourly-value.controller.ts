import { DerivedHourlyValueDTO } from '../dto/derived-hourly-value.dto';

import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { DerivedHourlyValueService } from './derived-hourly-value.service';
import { DerivedHourlyValueParamsDto } from '../dto/derived-hourly-value-params.dto';

@ApiTags('Emissions')
@Controller('emissions')
@ApiSecurity('APIKey')
export class DerivedHourlyValueController {
  constructor(private readonly service: DerivedHourlyValueService) {}

  @Get('derived-hourly-values')
  @ApiOkResponse({
    description:
      'Exports derived hourly values for specified ORIS codes and reporting period.',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  supplementaryExport(
    @Query() params: DerivedHourlyValueParamsDto,
  ): Promise<DerivedHourlyValueDTO[]> {
    return this.service.supplementaryExport(params);
  }
}
