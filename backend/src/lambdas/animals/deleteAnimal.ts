import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { deleteAnimal } from "../../services/animalService";
import { deleteAllImagesForAnimal } from "../../services/animalImagesService";
import { deleteMedicalRecordByAnimalId } from "../../services/medicalRecordService";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };

  try {
    if (!event.pathParameters?.id) {
      return { statusCode: 400, headers, body: "Missing ID" };
    }

    const id = parseInt(event.pathParameters.id, 10);
    
    await deleteAllImagesForAnimal(process.env.BUCKET_NAME!, id)
    await deleteMedicalRecordByAnimalId(id);
    await deleteAnimal(id);

    return { statusCode: 204, headers, body: "" };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
