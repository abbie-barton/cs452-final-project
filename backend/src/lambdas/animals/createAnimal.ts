import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { createAnimal } from "../../services/animalService";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (!event.body) {
      return { statusCode: 400, body: "Missing request body" };
    }

    const data = JSON.parse(event.body);
    const created = await createAnimal(data);

    return {
      statusCode: 201,
      body: JSON.stringify(created),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Server error" }),
    };
  }
};
