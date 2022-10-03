import { registerAs } from '@nestjs/config';
import {
  getConfigValue,
  getConfigValueNumber,
  getConfigValueBoolean,
} from '@us-epa-camd/easey-common/utilities';

require('dotenv').config();

const path = getConfigValue('EASEY_EMISSIONS_API_PATH', 'emissions-mgmt');
const host = getConfigValue('EASEY_EMISSIONS_API_HOST', 'localhost');
const port = getConfigValueNumber('EASEY_EMISSIONS_API_PORT', 8040);

export const PAGINATION_MAX_PER_PAGE = getConfigValueNumber(
  'EASEY_EMISSIONS_API_PAGINATION_MAX_PER_PAGE', 500,
);

let uri = `https://${host}/${path}`;

if (host === 'localhost') {
  uri = `http://localhost:${port}/${path}`;
}

export default registerAs('app', () => ({
  name: 'emissions-api',
  host, port, path, uri,
  title: getConfigValue(
    'EASEY_EMISSIONS_API_TITLE', 'Emissions Management',
  ),
  description: getConfigValue(
    'EASEY_EMISSIONS_API_DESCRIPTION',
    'Emissions management API endpoints for apportioned emissions data (e.g. hourly, daily, monthly, annual, and ozone season)',
  ),
  apiHost: getConfigValue(
    'EASEY_API_GATEWAY_HOST', 'api.epa.gov/easey/dev',
  ),
  env: getConfigValue(
    'EASEY_EMISSIONS_API_ENV', 'local-dev',
  ),
  enableCors: getConfigValueBoolean(
    'EASEY_EMISSIONS_API_ENABLE_CORS', true,
  ),
  enableApiKey: getConfigValueBoolean(
    'EASEY_EMISSIONS_API_ENABLE_API_KEY',
  ),
  enableGlobalValidationPipes: getConfigValueBoolean(
    'EASEY_EMISSIONS_API_ENABLE_GLOBAL_VALIDATION_PIPE', true,
  ),
  version: getConfigValue(
    'EASEY_EMISSIONS_API_VERSION', 'v0.0.0',
  ),
  published: getConfigValue(
    'EASEY_EMISSIONS_API_PUBLISHED', 'local',
  ),
  perPageLimit: PAGINATION_MAX_PER_PAGE,
  submissionDays: getConfigValueNumber(
    'EASEY_EMISSIONS_API_SUBMISSION_DAYS', 38,
  ),
  secretToken: getConfigValue(
    'EASEY_EMISSIONS_API_SECRET_TOKEN',
  ),
  enableSecretToken: getConfigValueBoolean(
    'EASEY_EMISSIONS_API_ENABLE_SECRET_TOKEN',
  ),
  // ENABLES DEBUG CONSOLE LOGS
  enableDebug: getConfigValueBoolean(
    'EASEY_EMISSIONS_API_ENABLE_DEBUG',
  ),
}));
