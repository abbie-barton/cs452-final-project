import { ImageFile } from "../types/Image";
import {
  Title,
  Stack,
  FileInput,
  Text,
  Grid,
  Paper,
  Image,
  CloseButton,
  Badge,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { useEffect } from "react";

export default function ImageFileUpload({
  images,
  setImages,
  setDeletedImages
}: {
  images: ImageFile[];
  setImages: (images: ImageFile[]) => void;
  setDeletedImages?: React.Dispatch<React.SetStateAction<string[]>>
}) {
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
          const base64String = result.split(",")[1];
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

  useEffect(() => {
    console.log("images from imageFileUpload: ", images);
  }, [images]);

  const removeImage = (index: number) => {
    const img = images[index];

    if (img.isExisting && img.url && setDeletedImages) {
      setDeletedImages((prev) => [...prev, img.url as string]);
    }

    if (img.preview && img.preview.startsWith("blob:")) {
      URL.revokeObjectURL(img.preview);
    }

    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
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
                      style={{ zIndex: 1, backgroundColor: "white" }}
                    />
                    <Image
                      src={image.preview || image.url}
                      alt={`Preview ${index + 1}`}
                      height={120}
                      fit="cover"
                      radius="sm"
                    />
                    {image.isExisting && (
                      <Badge pos="absolute" bottom={5} left={5} size="xs">
                        Existing
                      </Badge>
                    )}
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </div>
        )}
      </Stack>
    </div>
  );
}
