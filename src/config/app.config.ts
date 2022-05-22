require('dotenv').config();
import { registerAs } from '@nestjs/config';
import { parseBool } from '@us-epa-camd/easey-common/utilities';

const path = process.env.EASEY_EMISSIONS_API_PATH || 'emissions-mgmt';
const host = process.env.EASEY_EMISSIONS_API_HOST || 'localhost';
const port = +process.env.EASEY_EMISSIONS_API_PORT || 8040;

export const PAGINATION_MAX_PER_PAGE =
  +process.env.EASEY_EMISSIONS_API_PAGINATION_MAX_PER_PAGE || 25000;

let uri = `https://${host}/${path}`;

if (host === 'localhost') {
  uri = `http://localhost:${port}/${path}`;
}

export default registerAs('app', () => ({
  name: 'emissions-api',
  title: process.env.EASEY_EMISSIONS_API_TITLE || 'Emissions Management',
  path,
  host,
  apiHost: process.env.EASEY_API_GATEWAY_HOST || 'api.epa.gov/easey/dev',
  port,
  uri,
  env: process.env.EASEY_EMISSIONS_API_ENV || 'local-dev',
  enableCors: parseBool(process.env.EASEY_EMISSIONS_API_ENABLE_CORS, true),
  enableApiKey: parseBool(process.env.EASEY_EMISSIONS_API_ENABLE_API_KEY, true),
  enableAuthToken: parseBool(process.env.EASEY_EMISSIONS_API_ENABLE_AUTH_TOKEN),
  enableGlobalValidationPipes: parseBool(
    process.env.EASEY_EMISSIONS_API_ENABLE_GLOBAL_VALIDATION_PIPE,
    true,
  ),
  version: process.env.EASEY_EMISSIONS_API_VERSION || 'v0.0.0',
  published: process.env.EASEY_EMISSIONS_API_PUBLISHED || 'local',
  perPageLimit: PAGINATION_MAX_PER_PAGE,
  submissionDays: +process.env.EASEY_EMISSIONS_API_SUBMISSION_DAYS || 38,
  streamBatchSize: +process.env.EASEY_EMISSIONS_API_STREAM_BATCH_SIZE || 20000,
  streamHighWaterMark: +process.env.EASEY_EMISSIONS_API_STREAM_HIGH_WATER_MARK || 100000,
  streamDelay: +process.env.EASEY_EMISSIONS_API_STREAM_DELAY || 100, //100 Miliseconds
  streamBufferSize: +process.env.EASEY_EMISSIONS_API_BUFFER_SIZE || 1048576, //1MB
}));
