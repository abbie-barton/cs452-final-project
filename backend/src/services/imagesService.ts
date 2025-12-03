// lib/services/uploadAnimalImagesService.ts

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { createAnimalImages } from "./animalImagesService";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function uploadAnimalImages(
  bucketName: string,
  animalId: number,
  files: { base64: string; contentType: string }[]
) {
  if (!bucketName) {
    throw new Error("Missing bucket name");
  }

  const uploadedUrls: string[] = [];

  for (const file of files) {
    const buffer = Buffer.from(file.base64, "base64");

    const key = `animals/${animalId}/${randomUUID()}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.contentType,
    });

    await s3.send(command);

    const url = `https://${bucketName}.s3.amazonaws.com/${key}`;
    uploadedUrls.push(url);
  }

  await createAnimalImages(animalId, uploadedUrls);

  return uploadedUrls;
}
