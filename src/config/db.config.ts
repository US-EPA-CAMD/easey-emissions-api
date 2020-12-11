import { registerAs } from '@nestjs/config';

let pgHost = process.env.EASEY_DB_HOST || 'database';
let pgPort = process.env.EASEY_DB_PORT || 5432;
let pgUser = process.env.EASEY_DB_USER || 'postgres';
let pgPwd = process.env.EASEY_DB_PWD || 'password';
let pgDb = process.env.EASEY_DB_NAME || 'postgres';

if (process.env.VCAP_SERVICES) {
  const vcapSvc = JSON.parse(process.env.VCAP_SERVICES);
  const vcapSvcCreds = vcapSvc['aws-rds'][0].credentials;
  
  pgHost = vcapSvcCreds.host;
  pgPort = +vcapSvcCreds.port;
  pgUser = vcapSvcCreds.username;
  pgPwd = vcapSvcCreds.password;
  pgDb = vcapSvcCreds.name;
}

export default registerAs('database', () => ({
  host: pgHost,
  port: pgPort,
  user: pgUser,
  pwd: pgPwd,
  name: pgDb,
}));