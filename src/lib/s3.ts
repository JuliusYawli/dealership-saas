import { randomUUID } from "crypto";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!client) {
    client = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
      }
    });
  }
  return client;
}

function getBucket(): string {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) throw new Error("S3_BUCKET is not configured");
  return bucket;
}

export function buildFileKey(dealershipId: string, vehicleId: string, fileName: string) {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${dealershipId}/${vehicleId}/${randomUUID()}-${safeName}`;
}

export async function createUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({ Bucket: getBucket(), Key: key, ContentType: contentType });
  return getSignedUrl(getS3Client(), command, { expiresIn: 300 });
}

export async function createDownloadUrl(key: string) {
  const command = new GetObjectCommand({ Bucket: getBucket(), Key: key });
  return getSignedUrl(getS3Client(), command, { expiresIn: 3600 });
}

export async function deleteObject(key: string) {
  const command = new DeleteObjectCommand({ Bucket: getBucket(), Key: key });
  await getS3Client().send(command);
}
