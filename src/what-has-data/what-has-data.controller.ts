import { Get, Controller, Query } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiSecurity } from '@nestjs/swagger';

import { WhatHasDataService } from './what-has-data.service';
import { WhatHasDataParamsDTO } from '../dto/what-has-data.params.dto';

@Controller()
@ApiSecurity('APIKey')
export class WhatHasDataController {
  constructor(private service: WhatHasDataService) {}

  @Get()
  @ApiExcludeEndpoint() // Excluding this endpoint from the Swagger documentation because it takes a long time to run during a security scan
  whatHasData(@Query() dto: WhatHasDataParamsDTO): Promise<any> {
    return this.service.whatHasData(dto.dataType, dto.workspace);
  }
}
