import { Module } from '@nestjs/common';

import { EmissionsModule } from '../emissions/emissions.module';
import { WhatHasDataController } from './what-has-data.controller';
import { WhatHasDataService } from './what-has-data.service';

@Module({
  imports: [EmissionsModule],
  controllers: [WhatHasDataController],
  providers: [WhatHasDataService],
})
export class WhatHasDataModule {}
