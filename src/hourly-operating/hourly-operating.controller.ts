import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { HourlyOperatingService } from './hourly-operating.service';
import { HourlyOperatingParamsDto } from '../dto/hourly-operating.params.dto';
import { HourlyOperatingDTO } from '../dto/hourly-operating.dto';

@ApiTags('Hourly Operating')
@Controller('emissions')
@ApiSecurity('APIKey')
export class HourlyOperatingController {
  constructor(private readonly service: HourlyOperatingService) {}

  @Get('hourly-operating-data')
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'orisCode',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'locationName',
    required: false,
    explode: false,
  })
  @ApiOkResponse({
    description:
      'Exports hourly operating data for specified ORIS codes and reporting period.',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  supplementaryExport(
    @Query() params: HourlyOperatingParamsDto,
  ): Promise<HourlyOperatingDTO[]> {
    return this.service.supplementaryExport(params);
  }
}
