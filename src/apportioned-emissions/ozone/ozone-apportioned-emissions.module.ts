import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OzoneApportionedEmissionsController } from './ozone-apportioned-emissions.controller';
import { OzoneApportionedEmissionsService } from './ozone-apportioned-emissions.service';
import { OzoneUnitDataRepository } from './ozone-unit-data.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OzoneUnitDataRepository])],
  controllers: [OzoneApportionedEmissionsController],
  providers: [
    ConfigService,
    OzoneApportionedEmissionsService,
    OzoneUnitDataRepository,
  ],
  exports: [TypeOrmModule, OzoneUnitDataRepository],
})
export class OzoneApportionedEmissionsModule {}
