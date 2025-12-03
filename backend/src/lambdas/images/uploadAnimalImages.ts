import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { uploadAnimalImages } from "../../services/imagesService";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const body = JSON.parse(event.body ?? "{}");

    const { animalId, files } = body;

    if (!animalId || !files?.length) {
      return { statusCode: 400, body: "animalId and files are required" }
    }

    const bucketName = process.env.BUCKET_NAME!;

    const urls = await uploadAnimalImages(bucketName, animalId, files);

    return {
      statusCode: 200,
      body: JSON.stringify({ urls }),
    };

  } catch (error: any) {
    console.error("Upload error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
