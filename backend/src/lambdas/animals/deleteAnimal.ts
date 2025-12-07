import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { deleteAnimal } from "../../services/animalService";
import { deleteAllImagesForAnimal } from "../../services/animalImagesService";
import { deleteMedicalRecordByAnimalId } from "../../services/medicalRecordService";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (!event.pathParameters?.id) {
      return { statusCode: 400, body: "Missing ID" };
    }

    const id = parseInt(event.pathParameters.id, 10);
    
    await deleteAllImagesForAnimal(process.env.ANIMAL_IMAGES_BUCKET!, id)
    await deleteMedicalRecordByAnimalId(id);
    await deleteAnimal(id);

    return { statusCode: 204, body: "" };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
