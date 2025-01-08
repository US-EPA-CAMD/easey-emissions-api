import {
    ApiExcludeEndpoint,
    ApiExcludeController,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { getConfigValue } from '@us-epa-camd/easey-common/utilities';
import { shouldIncludeInSwaggerDoc } from '@us-epa-camd/easey-common/utilities/common-swagger';

const env = getConfigValue('EASEY_EMISSIONS_API_ENV', 'local-dev');

export function ApiExcludeControllerByEnv() {
    return applyDecorators(ApiExcludeController( !shouldIncludeInSwaggerDoc(env) ));
}

export function ApiExcludeEndpointByEnv() {
    return applyDecorators(ApiExcludeEndpoint( !shouldIncludeInSwaggerDoc(env) ));
}
