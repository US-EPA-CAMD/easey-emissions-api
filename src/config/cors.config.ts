import { registerAs } from '@nestjs/config';

export default registerAs('cors', () => ({
  origins: process.env.EASEY_EMISSIONS_API_CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000',
  exposedHeaders: process.env.EASEY_EMISSIONS_API_CORS_EXPOSED_HEADERS || '*',  
}));
