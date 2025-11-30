import { getPool } from "../db/mysql";
import { Animal } from "../../../shared/dist/types/Animal";

export async function createAnimal(animal: Animal): Promise<Animal> {
  const pool = await getPool();

  const [result] = await pool.execute(
    "INSERT INTO animal (name, breed, species, site, intake_date, color, location_found, description, size, gender, spayed_or_neutered, available_for_adoption, housetrained, declawed, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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

export async function getAnimals(): Promise<Animal[]> {
  const pool = await getPool();

  const [rows] = await pool.query("SELECT * FROM animal");
  return rows as Animal[];
}
