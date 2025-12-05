import { useState } from "react";
import {
  Title,
  Container,
  Textarea,
  Stack,
  Button,
  Group,
  Paper,
  Divider,
  Loader,
} from "@mantine/core";
import { Site, Size, Gender, Animal } from "../../types/Animal";
import { createAnimal } from "../../api/animals";
import { useNavigate } from "react-router-dom";
import { ImageFile, ImageUpload } from "../../types/Image";
import { uploadAnimalImages } from "../../api/images";
import ImageFileUpload from "../../components/ImageFileUpload";
import BasicInfo from "./form-components/BasicInfo";
import ShelterInfo from "./form-components/ShelterInfo";
import CheckboxesInfo from "./form-components/CheckboxesInfo";

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

  const uploadImages = async (animalId: number) => {
    if (images.length === 0) return;

    const files: ImageUpload[] = images
      .filter((img) => !img.isExisting)
      .map((img) => ({
        base64: img.base64!,
        contentType: img.contentType!,
      }));

    await uploadAnimalImages(animalId, files);
    console.log("Uploading images:", files);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    createAnimal(formData as Animal)
      .then(async (savedAnimal) => {
        console.log("Animal saved:", savedAnimal);
        if (savedAnimal.id) {
          await uploadImages(savedAnimal.id);
        }
        navigate("/animals", {
          state: { message: "Animal created successfully!" },
        });
      })
      .catch((error) => {
        console.error("Error saving animal:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
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

            <BasicInfo formData={formData} setFormData={setFormData} isSubmitting={isSubmitting} />
          </div>

          <Divider />

          <div>
            <Title order={3} size="h4" mb="md" c="purple">
              Shelter Information
            </Title>
            <ShelterInfo
              formData={formData}
              setFormData={setFormData}
              intakeDate={intakeDate}
              setIntakeDate={setIntakeDate}
              isSubmitting={isSubmitting}
            />
          </div>

          <Divider />

          <ImageFileUpload images={images} setImages={setImages} />

          <Divider />

          <div>
            <Title order={3} size="h4" mb="md" c="purple">
              Medical & Behavioral Details
            </Title>
            <CheckboxesInfo
              formData={formData}
              setFormData={setFormData}
              isSubmitting={isSubmitting}
            />
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
