// lib/services/uploadAnimalImagesService.ts

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import {
  createAnimalImages,
  deleteAnimalImagesByUrls,
} from "./animalImagesService";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function uploadAnimalImages(
  bucketName: string,
  animalId: number,
  files: { base64: string; contentType: string }[]
) {
  try {
    console.log("inside uploadAnimalImages")
    console.log(JSON.stringify(files))
    if (!bucketName) {
      throw new Error("Missing bucket name");
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      console.log("inside for loop")
      const buffer = Buffer.from(file.base64, "base64");

      const key = `animals/${animalId}/${randomUUID()}`;

      console.log("key: ", key)
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.contentType,
      });

      await s3.send(command);
      console.log("pushed to s3")

      const url = `https://${bucketName}.s3.amazonaws.com/${key}`;
      uploadedUrls.push(url);
    }

    await createAnimalImages(animalId, uploadedUrls);
    console.log("created animal images in database")

    return uploadedUrls;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteAnimalImages(
  bucketName: string,
  imageUrls: string[]
) {
  if (!bucketName) {
    throw new Error("Missing bucket name");
  }

  if (!imageUrls || imageUrls.length === 0) {
    return { deleted: [] };
  }

  const deletedKeys: string[] = [];

  for (const url of imageUrls) {
    // Convert URL → key
    const key = url.split(`.amazonaws.com/`)[1];

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3.send(command);

    deletedKeys.push(key);
  }

  // Remove records from DB
  await deleteAnimalImagesByUrls(imageUrls);

  return { deleted: deletedKeys };
}
