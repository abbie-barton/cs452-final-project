export interface MedicalRecord {
  id?: number;
  animal_id: number;
  record_date: string;
  record_type: string;
  notes?: string;
}