import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SummaryValueService } from './summary-value.service';
import { SummaryValueDTO } from '../dto/summary-value.dto';
import { SummaryValueParamsDto } from '../dto/summary-value-params.dto';

@ApiTags('Emissions')
@Controller('emissions')
@ApiSecurity('APIKey')
export class SummaryValueController {
  constructor(private readonly service: SummaryValueService) {}

  @Get('summary-values')
  @ApiOkResponse({
    description:
      'Exports summary values for specified ORIS codes and reporting period range.',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  supplementaryExport(
    @Query() params: SummaryValueParamsDto,
  ): Promise<SummaryValueDTO[]> {
    return this.service.supplementaryExport(params);
  }
}
