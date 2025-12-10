import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { deleteAnimalImages } from "../../services/imagesService";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };

  try {
    const animalId = Number(event.pathParameters?.id);
    if (!animalId || isNaN(animalId)) {
      return { statusCode: 400, headers, body: "Invalid animal id" };
    }

    const body = JSON.parse(event.body ?? "{}");
    const { imageUrls } = body;

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return { statusCode: 400, headers, body: "imageUrls required" };
    }

    const bucketName = process.env.BUCKET_NAME!;
    await deleteAnimalImages(bucketName, imageUrls);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Images deleted" }),
    };

  } catch (error: any) {
    console.error("Delete error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
