import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getAnimalById, getAnimals } from "../../services/animalService";

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
      return { statusCode: 200, body: JSON.stringify(animal) };
    } else {
      const animals = await getAnimals();
      return { statusCode: 200, body: JSON.stringify(animals) };
    }
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
