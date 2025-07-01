import { Get, Query, Controller } from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
  ApiExtraModels,
  ApiQuery, getSchemaPath } from '@nestjs/swagger';

import { ApplicableApportionedEmissionsAttributesDTO } from '../dto/applicable-apportioned-emissions-attributes.dto';
import { ApplicableApportionedEmissionsAttributesParamsDTO } from '../dto/applicable-apportioned-emissions-attributes.params.dto';
import { ApportionedEmissionsService } from './apportioned-emissions.service';
import { BadRequestResponse, NotFoundResponse } from '@us-epa-camd/easey-common/utilities/common-swagger';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Emissions')
@ApiExtraModels()
@ApiExtraModels(ApplicableApportionedEmissionsAttributesDTO)
export class ApportionedEmissionsController {
  constructor(private readonly service: ApportionedEmissionsService) {}

  @Get('/attributes/applicable')
  @ApiOkResponse({
    description: 'Retrieves Applicable Emissions Attributes',
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
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'year',
    required: true,
    explode: false,
  })
  @ApiExtraModels(ApplicableApportionedEmissionsAttributesDTO)
  async getApplicableApportionedEmissionsAttributes(
    @Query()
    applicableApportionedEmissionsAttributesParamsDTO: ApplicableApportionedEmissionsAttributesParamsDTO,
  ): Promise<ArrayResponse<ApplicableApportionedEmissionsAttributesDTO>> {
     const applicableEmissionAttributes = await this.service.getApplicableApportionedEmissionsAttributes(
      applicableApportionedEmissionsAttributesParamsDTO,
    );
    return {
      items: applicableEmissionAttributes
    }
  }
}
