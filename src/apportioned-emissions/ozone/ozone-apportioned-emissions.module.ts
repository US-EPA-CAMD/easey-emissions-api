import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
import { OzoneApportionedEmissionsService } from './ozone-apportioned-emissions.service';
import { OzoneApportionedEmissionsController } from './ozone-apportioned-emissions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OzoneUnitDataRepository])],
  controllers: [OzoneApportionedEmissionsController],
  providers: [ConfigService, OzoneApportionedEmissionsService],
  exports: [TypeOrmModule],
})
export class OzoneApportionedEmissionsModule {}
