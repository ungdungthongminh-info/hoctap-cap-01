#!/usr/bin/env node

import { S3Client, PutBucketAclCommand, PutBucketCorsCommand, GetBucketPolicyCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';

// Load R2 config from .env
const dotenv = {};
process.env.R2_ACCOUNT_ID?.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) dotenv[key.trim()] = value.trim();
});

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET;
const R2_ENDPOINT = process.env.R2_ENDPOINT;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_ENDPOINT) {
  console.error('Missing R2 credentials in environment');
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function makeR2BucketPublic() {
  console.log('Setting R2 bucket to public access...');
  
  try {
    // Set bucket CORS policy
    const corsCommand = new PutBucketCorsCommand({
      Bucket: R2_BUCKET,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'HEAD'],
            AllowedOrigins: ['*'],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    });
    
    await s3Client.send(corsCommand);
    console.log('✓ CORS policy set');
    
    // Set bucket policy for public read
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${R2_BUCKET}/*`,
        },
      ],
    };
    
    const policyCommand = new PutBucketPolicyCommand({
      Bucket: R2_BUCKET,
      Policy: JSON.stringify(bucketPolicy),
    });
    
    await s3Client.send(policyCommand);
    console.log('✓ Bucket policy set for public read access');
    
    console.log('\n✓ R2 bucket is now publicly accessible!');
    
  } catch (error) {
    console.error('Error making bucket public:', error.message);
    process.exit(1);
  }
}

makeR2BucketPublic();
