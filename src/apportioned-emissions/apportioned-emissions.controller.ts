import { Get, Query, Controller } from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
  ApiExtraModels,
  ApiQuery,
} from '@nestjs/swagger';

import {
  BadRequestResponse,
  NotFoundResponse,
} from '../utils/swagger-decorator.const';

import { ApplicableApportionedEmissionsAttributesDTO } from '../dto/applicable-apportioned-emissions-attributes.dto';
import { ApplicableApportionedEmissionsAttributesParamsDTO } from '../dto/applicable-apportioned-emissions-attributes.params.dto';
import { ApportionedEmissionsService } from './apportioned-emissions.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Emissions')
@ApiExtraModels()
export class ApportionedEmissionsController {
  constructor(private readonly service: ApportionedEmissionsService) {}

  @Get('/attributes/applicable')
  @ApiOkResponse({
    description: 'Retrieves Applicable Emissions Attributes',
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'year',
    required: true,
    explode: false,
  })
  @ApiExtraModels(ApplicableApportionedEmissionsAttributesDTO)
  getApplicableApportionedEmissionsAttributes(
    @Query()
    applicableApportionedEmissionsAttributesParamsDTO: ApplicableApportionedEmissionsAttributesParamsDTO,
  ): Promise<ApplicableApportionedEmissionsAttributesDTO[]> {
    return this.service.getApplicableApportionedEmissionsAttributes(
      applicableApportionedEmissionsAttributesParamsDTO,
    );
  }
}
