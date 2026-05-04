#!/usr/bin/env node

import { S3Client, ListObjectsV2Command, CopyObjectCommand } from '@aws-sdk/client-s3';
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

const { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_ENDPOINT, R2_ACCOUNT_ID } = env;

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

async function updateR2FileAcls() {
  console.log('Listing all objects in R2 bucket...');
  
  try {
    let continuationToken = undefined;
    let totalFiles = 0;
    let updatedFiles = 0;

    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: R2_BUCKET,
        ContinuationToken: continuationToken,
        MaxKeys: 100,
      });

      const listResult = await s3Client.send(listCommand);
      const contents = listResult.Contents || [];
      
      console.log(`Found ${contents.length} objects in this batch`);

      for (const obj of contents) {
        totalFiles++;
        const key = obj.Key;
        
        // Copy object to itself with public-read ACL
        const copyCommand = new CopyObjectCommand({
          Bucket: R2_BUCKET,
          CopySource: `/${R2_BUCKET}/${key}`,
          Key: key,
          ACL: 'public-read',
          MetadataDirective: 'COPY',
        });

        try {
          await s3Client.send(copyCommand);
          updatedFiles++;
          console.log(`✓ Updated ACL: ${key}`);
        } catch (error) {
          console.error(`✗ Failed to update ACL for ${key}: ${error.message}`);
        }
      }

      continuationToken = listResult.NextContinuationToken;
    } while (continuationToken);

    console.log(`\n✓ Updated ${updatedFiles}/${totalFiles} files to public-read ACL`);
    
  } catch (error) {
    console.error('Error updating R2 ACLs:', error.message);
    process.exit(1);
  }
}

updateR2FileAcls();
