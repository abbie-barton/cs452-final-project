import { Grid, TextInput, Select, NumberInput } from "@mantine/core";
import { Gender, Size, Animal } from "../../../types/Animal";

interface BasicInfoProps {
  formData: Partial<Animal>;
  setFormData: (data: Partial<Animal>) => void;
  isSubmitting: boolean;
  errors?: Record<string, boolean>;
}

export default function BasicInfo({
  formData,
  setFormData,
  isSubmitting,
  errors = {},
}: BasicInfoProps) {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, sm: 6 }}>
        <TextInput
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={isSubmitting}
          error={errors.name && "Name is required"}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6 }}>
        <TextInput
          label="Species"
          value={formData.species}
          onChange={(e) =>
            setFormData({ ...formData, species: e.target.value })
          }
          required
          disabled={isSubmitting}
          error={errors.species && "Species is required"}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6 }}>
        <TextInput
          label="Breed"
          value={formData.breed}
          onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
          disabled={isSubmitting}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6 }}>
        <NumberInput
          label="Age"
          value={formData.age}
          onChange={(value) =>
            setFormData({ ...formData, age: value as number })
          }
          min={0}
          disabled={isSubmitting}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6 }}>
        <Select
          label="Gender"
          value={formData.gender}
          onChange={(value) =>
            setFormData({ ...formData, gender: value as Gender })
          }
          data={Object.values(Gender)}
          disabled={isSubmitting}
          error={errors.gender && "Gender is required"}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6 }}>
        <Select
          label="Size"
          value={formData.size}
          onChange={(value) =>
            setFormData({ ...formData, size: value as Size })
          }
          data={Object.values(Size)}
          disabled={isSubmitting}
          error={errors.size && "Size is required"}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6 }}>
        <TextInput
          label="Color"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          disabled={isSubmitting}
          required
          error={errors.color && "Color is required"}
        />
      </Grid.Col>
    </Grid>
  );
}
