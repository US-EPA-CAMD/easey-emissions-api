import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmissionsRepository } from '../emissions/emissions.repository';
import { WhatHasDataController } from './what-has-data.controller';
import { WhatHasDataService } from './what-has-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmissionsRepository])],
  controllers: [WhatHasDataController],
  providers: [EmissionsRepository, WhatHasDataService],
})
export class WhatHasDataModule {}
