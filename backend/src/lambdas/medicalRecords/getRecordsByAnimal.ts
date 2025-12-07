import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getRecordsByAnimalId } from "../../services/medicalRecordService";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const animalId = Number(event.pathParameters?.animalId);

    if (isNaN(animalId)) {
      return { statusCode: 400, body: "Invalid animal ID" };
    }

    const records = await getRecordsByAnimalId(animalId);

    return {
      statusCode: 200,
      body: JSON.stringify(records),
    };
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
