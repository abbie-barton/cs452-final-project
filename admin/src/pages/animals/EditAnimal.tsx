import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Center,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Site, Size, Gender, Animal } from "../../types/Animal";
import { getAnimalById, updateAnimal } from "../../api/animals";

export default function EditAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Animal> | null>(null);
  const [intakeDate, setIntakeDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getAnimalById(Number(id))
      .then((animal) => {
        setFormData(animal);

        if (animal.intake_date) {
          setIntakeDate(new Date(animal.intake_date));
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading animal:", error);
        setLoading(false);
      });
  }, [id]);

  const handleDateChange = (value: string | null) => {
    if (!value) {
      setIntakeDate(null);
      return;
    }

    const date = new Date(value);
    setIntakeDate(date);

    setFormData((prev) => ({
      ...prev,
      intake_date: date.toISOString().split("T")[0],
    }));
  };

  const handleSubmit = () => {
    if (!formData?.id) return;

    setIsSubmitting(true);

    updateAnimal(formData as Animal)
      .then(() => {
        navigate("/animals", { state: { message: "Animal updated successfully!" } });
      })
      .catch((error) => {
        console.error("Error updating animal:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (loading || !formData) {
    return (
      <Center h="60vh">
        <Loader size="lg" color="purple" />
      </Center>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="md">
        Edit Animal
      </Title>

      <Paper shadow="xs" p="xl" radius="md" withBorder>
        <Stack gap="xl">
          {/* BASIC INFO */}
          <div>
            <Title order={3} size="h4" mb="md" c="purple">
              Basic Information
            </Title>
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
          </div>

          <Divider />

          {/* SHELTER INFO */}
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
                  disabled={isSubmitting}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <DatePickerInput
                  label="Intake Date"
                  value={intakeDate}
                  onChange={handleDateChange}
                  disabled={isSubmitting}
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
                />
              </Grid.Col>
            </Grid>
          </div>

          <Divider />

          {/* CHECKBOXES */}
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

          <Divider />

          {/* DESCRIPTION */}
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            minRows={4}
            disabled={isSubmitting}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => navigate("/animals")}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              color="purple"
              disabled={isSubmitting}
              leftSection={
                isSubmitting ? <Loader size="xs" color="white" /> : null
              }
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
