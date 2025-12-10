import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Center,
} from "@mantine/core";
import { Animal } from "../../types/Animal";
import { getAnimalById, updateAnimal } from "../../api/animals";
import { uploadAnimalImages, deleteImages } from "../../api/images";
import ImageFileUpload from "../../components/ImageFileUpload";
import { ImageFile, ImageUpload } from "../../types/Image";
import BasicInfo from "./form-components/BasicInfo";
import ShelterInfo from "./form-components/ShelterInfo";
import CheckboxesInfo from "./form-components/CheckboxesInfo";
import NotificationModal from "../../components/NotificationModal";
import { MedicalRecord } from "../../types/MedicalRecord";
import MedicalRecords from "./form-components/MedicalRecords";
import {
  createMedicalRecord,
  getMedicalRecordsByAnimal,
  deleteMedicalRecord,
} from "../../api/medicalRecords";

export default function EditAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Animal> | null>(null);
  const [intakeDate, setIntakeDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [medicalRecords, setMedicalRecords] = useState<
    Omit<MedicalRecord, "animal_id">[]
  >([]);
  const [deletedRecordIds, setDeletedRecordIds] = useState<number[]>([]);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const showNotification = (message: string) => {
    setNotificationMessage(message);
    setNotificationOpen(true);

    setTimeout(() => {
      setNotificationOpen(false);
    }, 5000);
  };

  useEffect(() => {
    if (!id) return;

    getAnimalById(Number(id))
      .then((animal) => {
        const { images, ...animalData } = animal;
        setFormData(animalData);

        if (animal.intake_date) {
          setIntakeDate(new Date(animal.intake_date));
        }
        if (images) {
          console.log(images);
          const existingImageObjects: ImageFile[] = (images || []).map(
            (url: string) => ({
              preview: url,
              url: url,
              isExisting: true,
            })
          );
          setImages(existingImageObjects);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading animal:", error);
        showNotification(
          error?.message || "Failed to get animal. Please try again."
        );
        setLoading(false);
      });
    getMedicalRecordsByAnimal(Number(id)).then((records) => {
      setMedicalRecords(records);
    });
  }, [id]);

  const handleSubmit = () => {
    setErrors({});

    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    updateAnimal(formData as Animal)
      .then(async (savedAnimal) => {
        console.log("Animal updated", savedAnimal);
        await uploadImages(Number(id));
        await deleteRecords();

        navigate("/animals", {
          state: { message: "Animal updated successfully!" },
        });
      })
      .catch((error) => {
        console.error("Error saving animal:", error);
        showNotification(
          error?.message || "Failed to update animal. Please try again."
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const deleteRecords = async () => {
    if (deletedRecordIds.length === 0) return;
    await Promise.all(
      deletedRecordIds.map(async (recordId) => {
        return await deleteMedicalRecord(recordId);
      })
    );
  }

  const uploadImages = async (animalId: number) => {
    if (images.length === 0) return;

    const imagesToUpload = images.filter((img) => !img.isExisting);

    const filesToUpload: ImageUpload[] = imagesToUpload
      .filter((img) => !img.isExisting)
      .map((img) => ({
        base64: img.base64!,
        contentType: img.contentType!,
      }));

    console.log("Uploading images:", filesToUpload);
    await uploadAnimalImages(animalId, filesToUpload);
    if (deletedImages.length > 0) {
      await deleteImages(animalId, deletedImages);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};

    // Required fields
    if (formData === null) return false;
    if (!formData.name?.trim()) newErrors.name = true;
    if (!formData.species?.trim()) newErrors.species = true;
    if (!formData.color?.trim()) newErrors.color = true;
    if (!formData.site) newErrors.site = true;
    if (!formData.intake_date) newErrors.intake_date = true;
    if (!formData.location_found?.trim()) newErrors.location_found = true;
    if (!formData.size) newErrors.size = true;
    if (!formData.gender) newErrors.gender = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showNotification("Please fill in all required fields");
      return false;
    }

    return true;
  };

  if (loading || !formData) {
    return (
      <Center h="60vh">
        <Loader size="lg" color="purple" />
      </Center>
    );
  }

  return (
    <>
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

              <BasicInfo
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
                errors={errors}
              />
            </div>

            <Divider />

            {/* SHELTER INFO */}
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
                errors={errors}
              />
            </div>

            <Divider />

            <ImageFileUpload
              images={images}
              setImages={setImages}
              setDeletedImages={setDeletedImages}
            />

            <Divider />

            <div>
              <Title order={3} size="h4" mb="md" c="purple">
                Medical Records
              </Title>
              <MedicalRecords
                records={medicalRecords}
                setRecords={setMedicalRecords}
                deletedRecordIds={deletedRecordIds}
                setDeletedRecordIds={setDeletedRecordIds}
                isSubmitting={isSubmitting}
              />
            </div>

            <Divider />

            {/* CHECKBOXES */}
            <CheckboxesInfo
              formData={formData}
              setFormData={setFormData}
              isSubmitting={isSubmitting}
            />

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

      <NotificationModal
        message={notificationMessage}
        isOpen={notificationOpen}
        setIsOpen={setNotificationOpen}
        type={"error"}
      />
    </>
  );
}
