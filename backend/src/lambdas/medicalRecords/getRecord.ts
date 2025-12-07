import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getRecordById } from "../../services/medicalRecordService";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const id = Number(event.pathParameters?.id);

    if (isNaN(id)) {
      return { statusCode: 400, body: "Invalid record ID" };
    }

    const rows = await getRecordById(id);

    if (!rows.length) {
      return { statusCode: 404, body: "Medical record not found" };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(rows[0]),
    };
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
