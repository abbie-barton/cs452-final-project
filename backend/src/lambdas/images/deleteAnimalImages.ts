import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { deleteAnimalImages } from "../../services/imagesService";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const animalId = Number(event.pathParameters?.id);
    if (!animalId || isNaN(animalId)) {
      return { statusCode: 400, body: "Invalid animal id" };
    }

    const body = JSON.parse(event.body ?? "{}");
    const { imageUrls } = body;

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return { statusCode: 400, body: "imageUrls required" };
    }

    const bucketName = process.env.ANIMAL_IMAGES_BUCKET!;
    await deleteAnimalImages(bucketName, imageUrls);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Images deleted" }),
    };

  } catch (error: any) {
    console.error("Delete error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
