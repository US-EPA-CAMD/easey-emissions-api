import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';

export const BadRequestResponse = () =>
  ApiBadRequestResponse({
    description: 'Invalid Request',
  });

export const NotFoundResponse = () =>
  ApiNotFoundResponse({
    description: 'Resource Not Found',
  });

export function ApiQueryMultiSelect() {
  return applyDecorators(
    ApiQuery({style: 'pipeDelimited', name: 'state', required: false, explode: false,}),
    ApiQuery({style: 'pipeDelimited', name: 'facilityId', required: false, explode: false,}),
    ApiQuery({style: 'pipeDelimited', name: 'unitType', required: false, explode: false,}),
    ApiQuery({style: 'pipeDelimited', name: 'controlTechnologies', required: false, explode: false,}),
    ApiQuery({style: 'pipeDelimited', name: 'unitFuelType', required: false, explode: false,}),
    ApiQuery({style: 'pipeDelimited', name: 'program', required: false, explode: false,}),
  );
}
