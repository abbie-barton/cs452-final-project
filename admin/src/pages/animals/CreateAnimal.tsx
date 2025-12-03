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
  Image,
  FileInput,
  Text,
  CloseButton
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Site, Size, Gender, Animal } from "../../types/Animal";
import { createAnimal } from "../../api/animals";
import { useNavigate } from "react-router-dom";
import { IconUpload, IconPhoto } from "@tabler/icons-react";
import { ImageFile, ImageUpload } from "../../types/Image";
import { uploadAnimalImages } from "../../api/images";

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
  const [images, setImages] = useState<ImageFile[]>([]);

  const handleFileUpload = async (files: File[] | null) => {
    if (!files || files.length === 0) return;

    const newImages: ImageFile[] = [];

    for (const file of files) {
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove the data URL prefix to get just the base64 string
          const base64String = result.split(',')[1];
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Create preview URL
      const preview = URL.createObjectURL(file);

      newImages.push({
        base64,
        contentType: file.type,
        preview,
      });
    }

    setImages([...images, ...newImages]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const uploadImages = async (animalId: number) => {
    if (images.length === 0) return;

    const files: ImageUpload[] =  images.map(img => ({
        base64: img.base64,
        contentType: img.contentType,
      }));

    await uploadAnimalImages(animalId, files);
    console.log('Uploading images:', files);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    createAnimal(formData as Animal)
      .then((savedAnimal) => {
        console.log("Animal saved:", savedAnimal);
        if (savedAnimal.id) {
            uploadImages(savedAnimal.id);
        }
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
              Photos
            </Title>
            <Stack gap="md">
              <FileInput
                label="Upload Images"
                placeholder="Select images"
                leftSection={<IconUpload />}
                accept="image/png,image/jpeg,image/jpg"
                multiple
                onChange={handleFileUpload}
                disabled={isSubmitting}
                size="md"
                description="You can upload multiple images (PNG, JPEG)"
              />

              {images.length > 0 && (
                <div>
                  <Text size="sm" fw={500} mb="xs">
                    Selected Images ({images.length})
                  </Text>
                  <Grid>
                    {images.map((image, index) => (
                      <Grid.Col span={{ base: 6, sm: 4, md: 3 }} key={index}>
                        <Paper pos="relative" withBorder p="xs">
                          <CloseButton
                            pos="absolute"
                            top={5}
                            right={5}
                            onClick={() => removeImage(index)}
                            size="sm"
                            style={{ zIndex: 1, backgroundColor: 'white' }}
                          />
                          <Image
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            height={120}
                            fit="cover"
                            radius="sm"
                          />
                        </Paper>
                      </Grid.Col>
                    ))}
                  </Grid>
                </div>
              )}
            </Stack>
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
