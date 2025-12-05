import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getAnimalById, getAnimals } from "../../services/animalService";
import { getAnimalImages } from "../../services/animalImagesService";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (event.pathParameters?.id) {
      const id = Number(event.pathParameters.id);

      if (isNaN(id)) {
        return { statusCode: 400, body: "Invalid ID" };
      }

      const animal = await getAnimalById(id);

      if (!animal) {
        return { statusCode: 404, body: "Animal not found" };
      }

      const images = await getAnimalImages(id);

      return {
        statusCode: 200,
        body: JSON.stringify({ ...animal, images }),
      };
    } 
    else {
      const page = Number(event.queryStringParameters?.page || 1);
      const limit = Number(event.queryStringParameters?.limit || 10);
      const offset = (page - 1) * limit;

      const { animals, total } = await getAnimals(limit, page);

      return {
        statusCode: 200,
        body: JSON.stringify({
          animals,
          total,
          page,
          totalPages: Math.ceil(total / limit)
        }),
      };
    }
  } 
  catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
