import { Get, Query, Controller } from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
  ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

import { MatsApportionedEmissionsService } from './mats-apportioned-emissions.service';
import { ApplicableApportionedEmissionsAttributesParamsDTO } from '../../dto/applicable-apportioned-emissions-attributes.params.dto';
import { ApplicableApportionedEmissionsAttributesDTO } from '../../dto/applicable-apportioned-emissions-attributes.dto';
import { BadRequestResponse, NotFoundResponse } from '@us-epa-camd/easey-common/utilities/common-swagger';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

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
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(ApplicableApportionedEmissionsAttributesDTO) },
              },
            },
          },
        },
      }
  })
  @BadRequestResponse()
  @NotFoundResponse()
  async getApplicableEmissions(
    @Query()
    params: ApplicableApportionedEmissionsAttributesParamsDTO,
  ): Promise<ArrayResponse<ApplicableApportionedEmissionsAttributesDTO>> {
    const matsList = await this.service.getApplicableApportionedEmissionsAttributes(params);
    return{
      items: matsList
    }
  }
}
