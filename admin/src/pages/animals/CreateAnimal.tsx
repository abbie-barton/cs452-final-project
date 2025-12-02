import { useState } from "react";
import {
  Title,
  Container,
  TextInput,
  Select,
  Textarea,
  Checkbox,
  Stack,
  Button,
  Group,
  NumberInput,
  Paper,
  Grid,
  Divider,
  Loader,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Site, Size, Gender, Animal } from "../../types/Animal";
import { createAnimal } from "../../api/animals";
import { useNavigate } from "react-router-dom";

export default function CreateAnimal() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Animal>>({
    name: "",
    species: "",
    breed: "",
    age: undefined,
    site: Site.Lehi,
    intake_date: new Date().toISOString().split("T")[0],
    color: "",
    location_found: "",
    size: Size.Medium,
    gender: Gender.Male,
    spayed_or_neutered: false,
    available_for_adoption: true,
    housetrained: false,
    declawed: false,
    description: "",
  });

  const [intakeDate, setIntakeDate] = useState<Date | null>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    createAnimal(formData as Animal)
      .then((savedAnimal) => {
        console.log("Animal saved:", savedAnimal);
        navigate("/animals", { state: { message: 'Animal created successfully!' } });
      })
      .catch((error) => {
        console.error("Error saving animal:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

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
    <Container size="lg" py="xl">
      <Title order={1} mb="md">
        Add New Animal
      </Title>
      <Title order={4} c="dimmed" fw={400} mb="xl">
        Fill out the form below to add a new animal to the shelter
      </Title>

      <Paper shadow="xs" p="xl" radius="md" withBorder>
        <Stack gap="xl">
          <div>
            <Title order={3} size="h4" mb="md" c="purple">
              Basic Information
            </Title>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Name"
                  placeholder="Enter animal name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  size="md"
                  disabled={isSubmitting}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Species"
                  placeholder="e.g., Dog, Cat, Rabbit"
                  value={formData.species}
                  onChange={(e) =>
                    setFormData({ ...formData, species: e.target.value })
                  }
                  required
                  size="md"
                  disabled={isSubmitting}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Breed"
                  placeholder="Enter breed (optional)"
                  value={formData.breed}
                  onChange={(e) =>
                    setFormData({ ...formData, breed: e.target.value })
                  }
                  size="md"
                  disabled={isSubmitting}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                  label="Age"
                  placeholder="Age in years (optional)"
                  value={formData.age}
                  onChange={(value) =>
                    setFormData({ ...formData, age: value as number })
                  }
                  min={0}
                  size="md"
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
                  required
                  size="md"
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
                  required
                  size="md"
                  disabled={isSubmitting}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Color"
                  placeholder="Enter animal color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  required
                  size="md"
                  disabled={isSubmitting}
                />
              </Grid.Col>
            </Grid>
          </div>

          <Divider />

          <div>
            <Title order={3} size="h4" mb="md" c="purple">
              Shelter Information
            </Title>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  label="Site Location"
                  value={formData.site}
                  onChange={(value) =>
                    setFormData({ ...formData, site: value as Site })
                  }
                  data={Object.values(Site)}
                  required
                  size="md"
                  disabled={isSubmitting}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <DatePickerInput
                  label="Intake Date"
                  placeholder="Select intake date"
                  value={intakeDate}
                  onChange={handleDateChange}
                  required
                  size="md"
                  disabled={isSubmitting}
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <TextInput
                  label="Location Found"
                  placeholder="Where the animal was found"
                  value={formData.location_found}
                  onChange={(e) =>
                    setFormData({ ...formData, location_found: e.target.value })
                  }
                  required
                  size="md"
                  disabled={isSubmitting}
                />
              </Grid.Col>
            </Grid>
          </div>

          <Divider />

          <div>
            <Title order={3} size="h4" mb="md" c="purple">
              Medical & Behavioral Details
            </Title>
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
                size="md"
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
                size="md"
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
                size="md"
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
                size="md"
                disabled={isSubmitting}
              />
            </Stack>
          </div>

          <Divider />

          <div>
            <Title order={3} size="h4" mb="md" c="purple">
              Additional Information
            </Title>
            <Textarea
              label="Description"
              placeholder="Add any additional notes or information about the animal (optional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              minRows={4}
              size="md"
              disabled={isSubmitting}
            />
          </div>

          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={() => navigate("/animals")}
              size="md"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              color="purple"
              size="md"
              disabled={isSubmitting}
              leftSection={
                isSubmitting ? <Loader size="xs" color="white" /> : null
              }
            >
              {isSubmitting ? "Adding Animal..." : "Add Animal"}
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
