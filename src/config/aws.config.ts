import { S3Client } from "@aws-sdk/client-s3";

require('dotenv').config();

export const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
});