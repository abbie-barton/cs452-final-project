import axios from "axios";
import { ImageUpload } from "../types/Image";

const API_BASE = "https://gxxmq0jkd0.execute-api.us-east-2.amazonaws.com"; 

export const uploadAnimalImages = async (
  id: number,
  images: ImageUpload[]
): Promise<boolean> => {

  const payload = {
    animalId: id,
    files: images.map(img => ({
      base64: img.base64,
      contentType: img.contentType,
    })),
  };

  const { data } = await axios.post(
    `${API_BASE}/animals/${id}/images`,
    payload
  );

  return true;
};
