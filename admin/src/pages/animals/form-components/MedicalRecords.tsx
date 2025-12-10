import { useState } from "react";
import {
  Stack,
  Button,
  Group,
  TextInput,
  Textarea,
  Paper,
  Text,
  ActionIcon,
  Grid,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { MedicalRecord } from "../../../types/MedicalRecord";
import "@mantine/dates/styles.css";

interface MedicalRecordsProps {
  records: Omit<MedicalRecord, "animal_id">[];
  setRecords: (records: Omit<MedicalRecord, "animal_id">[]) => void;
  deletedRecordIds?: number[];
  setDeletedRecordIds?: (ids: number[]) => void;
  isSubmitting?: boolean;
}

export default function MedicalRecords({
  records,
  setRecords,
  deletedRecordIds = [],
  setDeletedRecordIds,
  isSubmitting = false,
}: MedicalRecordsProps) {
  const [newRecord, setNewRecord] = useState<Omit<MedicalRecord, "animal_id">>({
    record_date: new Date().toISOString().split("T")[0],
    record_type: "",
    notes: "",
  });
  const [recordDate, setRecordDate] = useState<Date | null>(new Date());

  const handleDateChange = (value: string | null) => {
    if (!value) {
      setRecordDate(null);
      return;
    }

    const date = new Date(value);
    setRecordDate(date);
    setNewRecord({
      ...newRecord,
      record_date: date.toISOString().split("T")[0],
    });
  };

  const addRecord = () => {
    if (!newRecord.record_type.trim() || !newRecord.record_date) {
      return;
    }

    setRecords([...records, { ...newRecord }]);

    // Reset form
    setNewRecord({
      record_date: new Date().toISOString().split("T")[0],
      record_type: "",
      notes: "",
    });
    setRecordDate(new Date());
  };

  const removeRecord = (index: number) => {
    const recordToRemove = records[index];
    
    // If the record has an ID, it's an existing record from the database
    // Add it to deletedRecordIds so we can delete it from the backend
    if (recordToRemove.id && setDeletedRecordIds) {
      setDeletedRecordIds([...deletedRecordIds, recordToRemove.id]);
    }
    
    // Remove from the records array
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
  };

  return (
    <Stack gap="md">
      {/* Existing Records */}
      {records.length > 0 && (
        <Stack gap="sm">
          <Text size="sm" fw={500}>
            Medical Records ({records.length})
          </Text>
          {records.map((record, index) => (
            <Paper key={index} p="md" withBorder>
              <Group justify="space-between" wrap="nowrap">
                <div style={{ flex: 1 }}>
                  <Group gap="xs" mb="xs">
                    <Text size="sm" fw={600}>
                      {record.record_type}
                    </Text>
                    <Text size="sm" c="dimmed">
                      • {new Date(record.record_date).toLocaleDateString()}
                    </Text>
                  </Group>
                  {record.notes && (
                    <Text size="sm" c="dimmed">
                      {record.notes}
                    </Text>
                  )}
                </div>
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => removeRecord(index)}
                  disabled={isSubmitting}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Add New Record Form */}
      <Paper p="md" withBorder>
        <Text size="sm" fw={500} mb="md">
          Add Medical Record
        </Text>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Record Type"
              placeholder="e.g., Vaccination, Checkup, Surgery"
              value={newRecord.record_type}
              onChange={(e) =>
                setNewRecord({ ...newRecord, record_type: e.target.value })
              }
              required
              size="md"
              disabled={isSubmitting}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <DatePickerInput
              label="Record Date"
              placeholder="Select date"
              value={recordDate}
              onChange={handleDateChange}
              required
              size="md"
              disabled={isSubmitting}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea
              label="Notes"
              placeholder="Additional notes (optional)"
              value={newRecord.notes}
              onChange={(e) =>
                setNewRecord({ ...newRecord, notes: e.target.value })
              }
              minRows={2}
              size="md"
              disabled={isSubmitting}
            />
          </Grid.Col>
        </Grid>

        <Group justify="flex-end" mt="md">
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={addRecord}
            variant="light"
            color="purple"
            disabled={isSubmitting || !newRecord.record_type.trim()}
          >
            Add Record
          </Button>
        </Group>
      </Paper>
    </Stack>
  );
}
