import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { createAnimal } from "../../services/animalService";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };

  try {
    console.log("🐶 createAnimal Lambda invoked");
    if (!event.body) {
      return { statusCode: 400, headers, body: "Missing request body" };
    }

    const data = JSON.parse(event.body);
    console.log(data);
    const created = await createAnimal(data);
    console.log("created animal");

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(created),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || "Server error" }),
    };
  }
};
