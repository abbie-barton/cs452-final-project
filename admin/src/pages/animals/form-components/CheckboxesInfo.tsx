import { Stack, Checkbox } from "@mantine/core";
import { Animal } from "../../../types/Animal";

interface MedicalBehavioralInfoProps {
  formData: Partial<Animal>;
  setFormData: (data: Partial<Animal>) => void;
  isSubmitting: boolean;
}

export default function MedicalBehavioralInfo({ 
  formData, 
  setFormData, 
  isSubmitting 
}: MedicalBehavioralInfoProps) {
  return (
    <Stack gap="sm">
      <Checkbox
        label="Spayed or Neutered"
        checked={formData.spayed_or_neutered}
        onChange={(e) =>
          setFormData({
            ...formData,
            spayed_or_neutered: e.currentTarget.checked,
          })
        }
        disabled={isSubmitting}
      />

      <Checkbox
        label="Available for Adoption"
        checked={formData.available_for_adoption}
        onChange={(e) =>
          setFormData({
            ...formData,
            available_for_adoption: e.currentTarget.checked,
          })
        }
        disabled={isSubmitting}
      />

      <Checkbox
        label="Housetrained"
        checked={formData.housetrained}
        onChange={(e) =>
          setFormData({
            ...formData,
            housetrained: e.currentTarget.checked,
          })
        }
        disabled={isSubmitting}
      />

      <Checkbox
        label="Declawed"
        checked={formData.declawed}
        onChange={(e) =>
          setFormData({
            ...formData,
            declawed: e.currentTarget.checked,
          })
        }
        disabled={isSubmitting}
      />
    </Stack>
  );
}