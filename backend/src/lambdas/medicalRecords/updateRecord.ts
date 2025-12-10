import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { updateMedicalRecord } from "../../services/medicalRecordService";

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

    const body = JSON.parse(event.body || "{}");

    await updateMedicalRecord(id, {
      record_date: body.record_date,
      record_type: body.record_type,
      notes: body.notes,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Medical record updated" }),
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
