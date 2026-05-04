#!/usr/bin/env node

import { S3Client, PutBucketPolicyCommand } from '@aws-sdk/client-s3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ENV_FILE = path.join(SCRIPT_DIR, '..', '.env.r2');

// Parse .env.r2 file
const envContent = fs.readFileSync(ENV_FILE, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, value] = trimmed.split('=');
    if (key && value) env[key.trim()] = value.trim();
  }
});

const { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_ENDPOINT } = env;

if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_ENDPOINT) {
  console.error('Missing R2 env vars in .env.r2');
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

async function setBucketPolicyPublic() {
  console.log('Setting bucket policy for public read access...');
  
  try {
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
    console.log('✓ Bucket policy set for public read access!');
    console.log(`\n✓ R2 bucket "${R2_BUCKET}" is now publicly readable`);
    
  } catch (error) {
    console.error('Error setting bucket policy:', error.message);
    process.exit(1);
  }
}

setBucketPolicyPublic();
