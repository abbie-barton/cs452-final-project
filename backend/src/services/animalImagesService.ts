// lib/services/animalImagesService.ts

import { getPool } from "../db/mysql";

export async function createAnimalImages(
  animalId: number,
  imageUrls: string[]
): Promise<void> {
  const pool = await getPool();

  if (!imageUrls.length) return;

  const values = imageUrls.map(url => [animalId, url]);

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

  return (rows as any[]).map(r => r.image_url);
}

export async function deleteAnimalImages(animalId: number): Promise<void> {
  const pool = await getPool();

  await pool.execute(
    `DELETE FROM animal_image WHERE animal_id = ?`,
    [animalId]
  );
}
