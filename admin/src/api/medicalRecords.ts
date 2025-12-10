import axios from "axios";
import { MedicalRecord } from "../types/MedicalRecord";

const API_BASE = "https://gxxmq0jkd0.execute-api.us-east-2.amazonaws.com";

export const getMedicalRecordsByAnimal = async (
  animalId: number
): Promise<MedicalRecord[]> => {
  const { data } = await axios.get(
    `${API_BASE}/animals/${animalId}/medical-records`
  );
  return data;
};

export const createMedicalRecord = async (
  animalId: number,
  record: Omit<MedicalRecord, "animal_id">
): Promise<MedicalRecord> => {
  const { data } = await axios.post(
    `${API_BASE}/animals/${animalId}/medical-records`,
    record
  );
  return data;
};

export const getMedicalRecordById = async (
  recordId: number
): Promise<MedicalRecord> => {
  const { data } = await axios.get(`${API_BASE}/medical-records/${recordId}`);
  return data;
};

export const updateMedicalRecord = async (
  recordId: number,
  updates: Partial<MedicalRecord>
): Promise<MedicalRecord> => {
  const { data } = await axios.put(
    `${API_BASE}/medical-records/${recordId}`,
    updates
  );
  return data;
};

export const deleteMedicalRecord = async (recordId: number): Promise<void> => {
  await axios.delete(`${API_BASE}/medical-records/${recordId}`);
};
