// lib/services/animalImagesService.ts
import { S3Client } from "@aws-sdk/client-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getPool } from "../db/mysql";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function createAnimalImages(
  animalId: number,
  imageUrls: string[]
): Promise<void> {
  const pool = await getPool();

  if (!imageUrls.length) return;

  const values = imageUrls.map((url) => [animalId, url]);

  await pool.query(
    `
    INSERT INTO animal_image (animal_id, image_url)
    VALUES ?
    `,
    [values]
  );
}

export async function getAnimalImages(animalId: number): Promise<string[]> {
  const pool = await getPool();

  const [rows] = await pool.query(
    `SELECT image_url FROM animal_image WHERE animal_id = ?`,
    [animalId]
  );

  return (rows as any[]).map((r) => r.image_url);
}

export async function getImagesByAnimalId(animalId: number): Promise<string[]> {
  const pool = await getPool();

  const [rows]: any = await pool.query(
    `SELECT image_url FROM animal_images WHERE animal_id = ?`,
    [animalId]
  );

  return rows.map((row: any) => row.image_url);
}

export async function deleteAnimalImagesByAnimal(animalId: number) {
  if (!animalId) return;

  const pool = await getPool();

  await pool.query(`DELETE FROM animal_images WHERE animal_id = ?`, [animalId]);
}

export async function deleteAnimalImagesByUrls(urls: string[]) {
  const pool = await getPool();
  if (!urls.length) return;

  const placeholders = urls.map(() => "?").join(",");

  await pool.query(
    `
    DELETE FROM animal_images
    WHERE image_url IN (${placeholders})
  `,
    urls
  );
}

export async function deleteAllImagesForAnimal(
  bucketName: string,
  animalId: number
) {
  if (!animalId) throw new Error("Missing animalId");

  const urls = await getImagesByAnimalId(animalId);

  for (const url of urls) {
    const key = url.split(`.amazonaws.com/`)[1];

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3.send(command);
  }

  // Now delete from DB
  await deleteAnimalImagesByAnimal(animalId);

  return { deleted: urls.length };
}
