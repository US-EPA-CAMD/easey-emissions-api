import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WhatHasDataService } from './what-has-data.service';
import { WhatHasDataController } from './what-has-data.controller';
import { EmissionsRepository } from '../emissions/emissions.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmissionsRepository
    ])
  ],
  controllers: [WhatHasDataController],
  providers: [WhatHasDataService],
})
export class WhatHasDataModule {}
