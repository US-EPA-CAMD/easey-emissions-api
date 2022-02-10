require('dotenv').config();
import { registerAs } from '@nestjs/config';

const path = process.env.EASEY_EMISSIONS_API_PATH || 'emissions-mgmt';
const host = process.env.EASEY_EMISSIONS_API_HOST || 'localhost';
const port = +process.env.EASEY_EMISSIONS_API_PORT || 8040;

let uri = `https://${host}/${path}`;

if (host === 'localhost') {
  uri = `http://localhost:${port}/${path}`;
}

export const PAGINATION_MAX_PER_PAGE =
  +process.env.EASEY_EMISSIONS_API_PAGINATION_MAX_PER_PAGE || 25000;

const bool = (val: string, defaultVal?: boolean): boolean => {
  if (val === null || val === undefined) {
    return defaultVal;
  } else if (val === 'true') {
    return true;
  } else {
    return false;
  }
};

export default registerAs('app', () => ({
  name: 'emissions-api',
  title: process.env.EASEY_EMISSIONS_API_TITLE || 'Emissions Management',
  path,
  host,
  apiHost: process.env.EASEY_API_GATEWAY_HOST || 'api.epa.gov/easey/dev',
  port,
  uri,
  env: process.env.EASEY_EMISSIONS_API_ENV || 'local-dev',
  enableCors: bool(process.env.EASEY_NOTIFICATIONS_API_ENABLE_CORS, true),
  enableApiKey: bool(process.env.EASEY_NOTIFICATIONS_API_ENABLE_API_KEY, true),
  enableAuthToken: bool(process.env.EASEY_NOTIFICATIONS_API_ENABLE_AUTH_TOKEN),
  enableGlobalValidationPipes: bool(
    process.env.EASEY_NOTIFICATIONS_API_ENABLE_GLOBAL_VALIDATION_PIPE,
    true,
  ),
  version: process.env.EASEY_EMISSIONS_API_VERSION || 'v0.0.0',
  published: process.env.EASEY_EMISSIONS_API_PUBLISHED || 'local',
  perPageLimit: PAGINATION_MAX_PER_PAGE,
  submissionDays: +process.env.EASEY_EMISSIONS_API_SUBMISSION_DAYS || 38,
}));
