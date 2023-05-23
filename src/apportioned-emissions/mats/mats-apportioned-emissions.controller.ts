import { Get, Query, Controller } from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
  ApiExtraModels,
} from '@nestjs/swagger';

import { MatsApportionedEmissionsService } from './mats-apportioned-emissions.service';
import { ApplicableApportionedEmissionsAttributesParamsDTO } from '../../dto/applicable-apportioned-emissions-attributes.params.dto';
import { ApplicableApportionedEmissionsAttributesDTO } from '../../dto/applicable-apportioned-emissions-attributes.dto';

import {
  BadRequestResponse,
  NotFoundResponse,
} from '../../utils/swagger-decorator.const';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned MATS Emissions')
@ApiExtraModels(ApplicableApportionedEmissionsAttributesDTO)
export class MatsApportionedEmissionsController {
  constructor(private readonly service: MatsApportionedEmissionsService) {}

  @Get('attributes/applicable')
  @ApiExtraModels(ApplicableApportionedEmissionsAttributesDTO)
  @ApiOkResponse({
    description:
      'Retrieved All Applicable MATS Apportioned Emissions Attributes',
  })
  @BadRequestResponse()
  @NotFoundResponse()
  getApplicableEmissions(
    @Query()
    params: ApplicableApportionedEmissionsAttributesParamsDTO,
  ): Promise<ApplicableApportionedEmissionsAttributesDTO[]> {
    return this.service.getApplicableApportionedEmissionsAttributes(params);
  }
}
