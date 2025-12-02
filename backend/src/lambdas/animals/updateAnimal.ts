import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { updateAnimal } from "../../services/animalService";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (!event.body || !event.pathParameters?.id) {
      return { statusCode: 400, body: "Missing request body or ID" };
    }

    const data = JSON.parse(event.body);
    const id = parseInt(event.pathParameters.id, 10);

    await updateAnimal(id, data);

    return { statusCode: 204, body: "Animal updated successfully" };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
