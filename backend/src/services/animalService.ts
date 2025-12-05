import { getPool } from "../db/mysql";
import { Animal } from "../../../shared/dist/types/Animal";

export async function createAnimal(animal: Animal): Promise<Animal> {
  const pool = await getPool();

  const [result] = await pool.execute(
    `INSERT INTO animal 
      (name, breed, species, site, intake_date, color, location_found, description, size, gender, spayed_or_neutered, available_for_adoption, housetrained, declawed, age) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      animal.name,
      animal.breed ?? null,
      animal.species,
      animal.site,
      animal.intake_date,
      animal.color,
      animal.location_found,
      animal.description ?? null,
      animal.size,
      animal.gender,
      animal.spayed_or_neutered ?? null,
      animal.available_for_adoption ?? null,
      animal.housetrained ?? null,
      animal.declawed ?? null,
      animal.age ?? null,
    ]
  );

  const insertId = (result as any).insertId;
  const { id, ...animalWithoutId } = animal;
  return { id: insertId, ...animalWithoutId };
}

export async function getAnimals(
  limit = 10,
  page = 1
): Promise<{
  animals: Animal[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const pool = await getPool();
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * limit;

  const [rows] = await pool.query(
    "SELECT * FROM animal ORDER BY id DESC LIMIT ? OFFSET ?",
    [limit, offset]
  );

  const [countResult] = await pool.query(
    "SELECT COUNT(*) as total FROM animal"
  );

  const total = (countResult as any)[0].total;
  const totalPages = Math.ceil(total / limit);

  return {
    animals: rows as Animal[],
    total,
    page: safePage,
    totalPages,
  };
}

export async function getAnimalById(id: number): Promise<Animal | null> {
  const pool = await getPool();
  const [rows] = await pool.query("SELECT * FROM animal WHERE id = ?", [id]);
  const animals = rows as Animal[];
  return animals[0] ?? null;
}

export async function updateAnimal(
  id: number,
  data: Partial<Animal>
): Promise<void> {
  const pool = await getPool();
  const fields = Object.keys(data);
  const values = Object.values(data);

  if (fields.length === 0) return;

  const setString = fields.map((f) => `${f} = ?`).join(", ");
  await pool.execute(`UPDATE animal SET ${setString} WHERE id = ?`, [
    ...values,
    id,
  ]);
}

export async function deleteAnimal(id: number): Promise<void> {
  const pool = await getPool();
  await pool.execute("DELETE FROM animal WHERE id = ?", [id]);
}
