import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { HourlyOperatingService } from './hourly-operating.service';
import { HourlyOperatingParamsDto } from '../dto/hourly-operating.params.dto';
import { HourlyOperatingDTO } from '../dto/hourly-operating.dto';

@ApiTags('Emissions')
@Controller('emissions')
@ApiSecurity('APIKey')
export class HourlyOperatingController {
  constructor(private readonly service: HourlyOperatingService) {}

  @Get('summary-values')
  @ApiOkResponse({
    description:
      'Exports summary values for specified ORIS codes and reporting period.',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  supplementaryExport(
    @Query() params: HourlyOperatingParamsDto,
  ): Promise<HourlyOperatingDTO[]> {
    return this.service.supplementaryExport(params);
  }
}
