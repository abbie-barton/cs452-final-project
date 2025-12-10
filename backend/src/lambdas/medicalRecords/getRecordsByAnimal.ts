import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getRecordsByAnimalId } from "../../services/medicalRecordService";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };

  try {
    const animalId = Number(event.pathParameters?.animalId);

    if (isNaN(animalId)) {
      return { statusCode: 400, headers, body: "Invalid animal ID" };
    }

    const records = await getRecordsByAnimalId(animalId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(records),
    };
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
