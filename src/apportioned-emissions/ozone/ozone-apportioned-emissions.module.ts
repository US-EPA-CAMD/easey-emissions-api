import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
import { OzoneApportionedEmissionsService } from './ozone-apportioned-emissions.service';
import { OzoneApportionedEmissionsController } from './ozone-apportioned-emissions.controller';
import { StreamModule } from '@us-epa-camd/easey-common/stream';

@Module({
  imports: [
    TypeOrmModule.forFeature([OzoneUnitDataRepository]),
    HttpModule,
    StreamModule,
  ],
  controllers: [OzoneApportionedEmissionsController],
  providers: [ConfigService, OzoneApportionedEmissionsService],
  exports: [TypeOrmModule],
})
export class OzoneApportionedEmissionsModule {}
