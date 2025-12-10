import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getRecordById } from "../../services/medicalRecordService";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };

  try {
    const id = Number(event.pathParameters?.id);

    if (isNaN(id)) {
      return { statusCode: 400, headers, body: "Invalid record ID" };
    }

    const rows = await getRecordById(id);

    if (!rows.length) {
      return { statusCode: 404, headers, body: "Medical record not found" };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(rows[0]),
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
