import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from '@nestjs/config';
import { ReviewSubmitController } from './ReviewSubmit.controller';
import { ReviewSubmitService } from './ReviewSubmit.service';
import { EmissionsReviewSubmitRepository } from './ReviewSubmit.repository';
import { EmissionsReviewSubmitMap } from '../maps/emissions-review-submit.map';

@Module({
  imports: [TypeOrmModule.forFeature([EmissionsReviewSubmitRepository])],
  controllers: [ReviewSubmitController],
  providers: [ReviewSubmitService, ConfigService, EmissionsReviewSubmitMap],
})
export class ReviewSubmitModule {}
