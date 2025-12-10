import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { deleteMedicalRecord } from "../../services/medicalRecordService";

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

    await deleteMedicalRecord(id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Medical record deleted" }),
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
