import { registerAs } from '@nestjs/config';
import {
  getConfigValue,
  getConfigValueNumber,
  getConfigValueBoolean,
} from '@us-epa-camd/easey-common/utilities';

require('dotenv').config();

const host = getConfigValue('EASEY_EMISSIONS_API_HOST', 'localhost');
const port = getConfigValueNumber('EASEY_EMISSIONS_API_PORT', 8040);
const path = getConfigValue('EASEY_EMISSIONS_API_PATH', 'emissions-mgmt');

let uri = `https://${host}/${path}`;

if (host === 'localhost') {
  uri = `http://localhost:${port}/${path}`;
}

const apiHost = getConfigValue(
  'EASEY_API_GATEWAY_HOST',
  'api.epa.gov/easey/dev',
);

export const PAGINATION_MAX_PER_PAGE = getConfigValueNumber(
  'EASEY_EMISSIONS_API_PAGINATION_MAX_PER_PAGE',
  500,
);

export default registerAs('app', () => ({
  name: 'emissions-api',
  host,
  port,
  path,
  uri,
  title: getConfigValue('EASEY_EMISSIONS_API_TITLE', 'Emissions Management'),
  description: getConfigValue(
    'EASEY_EMISSIONS_API_DESCRIPTION',
    'Emissions management API endpoints for apportioned emissions data (e.g. hourly, daily, monthly, annual, and ozone season)',
  ),
  env: getConfigValue('EASEY_EMISSIONS_API_ENV', 'local-dev'),
  apiKey: getConfigValue('EASEY_EMISSIONS_API_KEY'),
  enableApiKey: getConfigValueBoolean('EASEY_EMISSIONS_API_ENABLE_API_KEY'),
  enableRoleGuard: getConfigValueBoolean(
    'EASEY_EMISSIONS_API_ENABLE_ROLE_GUARD',
    true,
  ),
  secretToken: getConfigValue('EASEY_EMISSIONS_API_SECRET_TOKEN'),
  enableSecretToken: getConfigValueBoolean(
    'EASEY_EMISSIONS_API_ENABLE_SECRET_TOKEN',
  ),
  enableCors: getConfigValueBoolean('EASEY_EMISSIONS_API_ENABLE_CORS', true),
  enableAuthToken: getConfigValueBoolean(
    'EASEY_EMISSIONS_API_ENABLE_AUTH_TOKEN',
    true,
  ),
  enableGlobalValidationPipes: getConfigValueBoolean(
    'EASEY_EMISSIONS_API_ENABLE_GLOBAL_VALIDATION_PIPE',
    true,
  ),
  version: getConfigValue('EASEY_EMISSIONS_API_VERSION', 'v0.0.0'),
  published: getConfigValue('EASEY_EMISSIONS_API_PUBLISHED', 'local'),
  submissionDays: getConfigValueNumber(
    'EASEY_EMISSIONS_API_SUBMISSION_DAYS',
    38,
  ),
  reqSizeLimit: getConfigValue('EASEY_EMISSIONS_API_REQ_SIZE_LIMIT', '30mb'),
  // ENABLES DEBUG CONSOLE LOGS
  enableDebug: getConfigValueBoolean('EASEY_EMISSIONS_API_ENABLE_DEBUG'),
  // NEEDS TO BE SET IN .ENV FILE FOR LOCAL DEVELOPMENT
  // FORMAT: { "userId": "", "roles": [ { "orisCode": 3, "role": "P" } ] }
  currentUser: getConfigValue(
    'EASEY_EMISSIONS_API_CURRENT_USER',
    '{"userId": ""}',
  ),
  enableRoleGuardCheckoutCheck: getConfigValueBoolean(
    'EASEY_EMISSIONS_API_ENABLE_ROLE_GUARD_CHECKOUT',
    true,
  ),
  bulkLoadMaxPoolSize: getConfigValueNumber(
    'EASEY_EMISSIONS_API_BULK_LOAD_MAX_POOL_SIZE',
    100,
  ),
  perPageLimit: PAGINATION_MAX_PER_PAGE,
  apiHost: apiHost,
  authApi: {
    uri: getConfigValue('EASEY_AUTH_API', `https://${apiHost}/auth-mgmt`),
  },
}));
