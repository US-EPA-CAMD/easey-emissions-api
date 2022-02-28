import { Get, Query, Controller } from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
  ApiExtraModels,
} from '@nestjs/swagger';

import { ApplicableMatsApportionedEmissionsAttributesDTO } from '../../dto/applicable-mats-apportioned-emissions-attributes.dto';
import { MatsApportionedEmissionsService } from './mats-apportioned-emissions.service';
import { ApplicableMatsApportionedEmissionsAttributesParamsDTO } from '../../dto/applicable-mats-apportioned-emissions-attributes-params.dto';
import {
  BadRequestResponse,
  NotFoundResponse,
} from '../../utils/swagger-decorator.const';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned MATS Emissions')
@ApiExtraModels(ApplicableMatsApportionedEmissionsAttributesDTO)
export class MatsApportionedEmissionsController {
  constructor(private readonly service: MatsApportionedEmissionsService) {}

  @Get('attributes/applicable')
  @ApiExtraModels(ApplicableMatsApportionedEmissionsAttributesDTO)
  @ApiOkResponse({
    description:
      'Retrieved All Applicable MATS Apportioned Emissions Attributes',
  })
  @BadRequestResponse()
  @NotFoundResponse()
  getApplicableEmissions(
    @Query()
    params: ApplicableMatsApportionedEmissionsAttributesParamsDTO,
  ): Promise<ApplicableMatsApportionedEmissionsAttributesDTO[]> {
    return this.service.getApplicableEmissions(params);
  }
}
