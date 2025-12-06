import { Grid, Select, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Site, Animal } from "../../../types/Animal";

interface ShelterInfoProps {
  formData: Partial<Animal>;
  setFormData: (data: Partial<Animal>) => void;
  intakeDate: Date | null;
  setIntakeDate: (date: Date | null) => void;
  isSubmitting: boolean;
  errors?: Record<string, boolean>;
}

export default function ShelterInfo({
  formData,
  setFormData,
  intakeDate,
  setIntakeDate,
  isSubmitting,
  errors = {},
}: ShelterInfoProps) {
  const handleDateChange = (value: string | null) => {
    if (!value) {
      setIntakeDate(null);
      return;
    }

    const date = new Date(value);
    setIntakeDate(date);

    setFormData({
      ...formData,
      intake_date: date.toISOString().split("T")[0],
    });
  };

  return (
    <Grid>
      <Grid.Col span={{ base: 12, sm: 6 }}>
        <Select
          label="Site Location"
          value={formData.site}
          onChange={(value) =>
            setFormData({ ...formData, site: value as Site })
          }
          data={Object.values(Site)}
          disabled={isSubmitting}
          error={errors.site && "Site is required"}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6 }}>
        <DatePickerInput
          label="Intake Date"
          value={intakeDate}
          onChange={handleDateChange}
          disabled={isSubmitting}
          error={errors.intake_date && "Intake date is required"}
        />
      </Grid.Col>

      <Grid.Col span={12}>
        <TextInput
          label="Location Found"
          value={formData.location_found}
          onChange={(e) =>
            setFormData({
              ...formData,
              location_found: e.target.value,
            })
          }
          disabled={isSubmitting}
          error={errors.location_found && "Location found is required"}
        />
      </Grid.Col>
    </Grid>
  );
}
