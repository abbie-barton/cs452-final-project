import { getPool } from "../db/mysql";

export async function getRecordsByAnimalId(animalId: number) {
  const pool = await getPool();
  const [rows] = await pool.query(
    "SELECT * FROM medical_record WHERE animal_id = ? ORDER BY record_date DESC",
    [animalId]
  );
  return rows;
}

export async function getRecordById(id: number) {
  const pool = await getPool();
  const [rows]: any = await pool.query(
    "SELECT * FROM medical_record WHERE id = ?",
    [id]
  );
  return rows;
}

export async function createMedicalRecord(data: {
  animal_id: number;
  record_date: string;
  record_type: string;
  notes?: string;
}) {
  try {
    const pool = await getPool();
    console.log(data);

    const [result]: any = await pool.query(
      `INSERT INTO medical_record (animal_id, record_date, record_type, notes)
     VALUES (?, ?, ?, ?)`,
      [data.animal_id, data.record_date, data.record_type, data.notes]
    );

    return { id: result.insertId, ...data };
  } catch (error) {
    console.error(error);
  }
}

export async function updateMedicalRecord(id: number, data: any) {
  const pool = await getPool();

  await pool.query(
    `UPDATE medical_record
     SET record_date = ?, record_type = ?, notes = ?
     WHERE id = ?`,
    [data.record_date, data.record_type, data.notes, id]
  );
}

export async function deleteMedicalRecord(id: number) {
  const pool = await getPool();
  await pool.query("DELETE FROM medical_record WHERE id = ?", [id]);
}

export async function deleteMedicalRecordByAnimalId(id: number) {
  const pool = await getPool();
  await pool.query("DELETE FROM medical_record WHERE animal_id = ?", [id]);
}
