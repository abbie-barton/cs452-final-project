import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { updateAnimal } from "../../services/animalService";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };

  try {
    if (!event.body || !event.pathParameters?.id) {
      return { statusCode: 400, headers, body: "Missing request body or ID" };
    }

    const data = JSON.parse(event.body);
    const id = parseInt(event.pathParameters.id, 10);

    await updateAnimal(id, data);

    return { statusCode: 204, headers, body: "Animal updated successfully" };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
