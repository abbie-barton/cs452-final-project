import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getAnimalById, getAnimals } from "../../services/animalService";
import { getAnimalImages } from "../../services/animalImagesService";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };

  try {
    if (event.pathParameters?.id) {
      const id = Number(event.pathParameters.id);

      if (isNaN(id)) {
        return { statusCode: 400, headers, body: "Invalid ID" };
      }

      const animal = await getAnimalById(id);
      console.log("animal from the lambda: ", JSON.stringify(animal));

      if (!animal) {
        return { statusCode: 404, headers, body: "Animal not found" };
      }

      const images = await getAnimalImages(id);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ...animal, images }),
      };
    } else {
      const page = Number(event.queryStringParameters?.page || 1);
      const limit = Number(event.queryStringParameters?.limit || 10);

      const { animals, total } = await getAnimals(limit, page, {
        name: event.queryStringParameters?.name,
        species: event.queryStringParameters?.species,
        site: event.queryStringParameters?.site,
        size: event.queryStringParameters?.size,
        gender: event.queryStringParameters?.gender,
        available:
          event.queryStringParameters?.available !== undefined
            ? event.queryStringParameters?.available === "true"
            : undefined,
        minAge: event.queryStringParameters?.minAge
          ? Number(event.queryStringParameters.minAge)
          : undefined,
        maxAge: event.queryStringParameters?.maxAge
          ? Number(event.queryStringParameters.maxAge)
          : undefined,
        sort:
          event.queryStringParameters?.sort === "oldest" ? "oldest" : "newest",
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          animals,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        }),
      };
    }
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
