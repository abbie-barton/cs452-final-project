import { Grid, TextInput, Select, NumberInput } from "@mantine/core";
import { Gender, Size, Animal } from "../../../types/Animal";

interface BasicInfoProps {
  formData: Partial<Animal>;
  setFormData: (data: Partial<Animal>) => void;
  isSubmitting: boolean;
}

export default function BasicInfo({ formData, setFormData, isSubmitting }: BasicInfoProps) {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, sm: 6 }}>
        <TextInput
          label="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
          disabled={isSubmitting}
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
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6 }}>
        <TextInput
          label="Breed"
          value={formData.breed}
          onChange={(e) =>
            setFormData({ ...formData, breed: e.target.value })
          }
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
        />
      </Grid.Col>
    </Grid>
  );
}