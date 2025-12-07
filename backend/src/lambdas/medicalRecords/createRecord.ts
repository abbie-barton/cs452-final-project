import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { createMedicalRecord } from "../../services/medicalRecordService";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const animalId = Number(event.pathParameters?.animalId);

    if (isNaN(animalId)) {
      return { statusCode: 400, body: "Invalid animal ID" };
    }

    const body = JSON.parse(event.body || "{}");

    if (!body.record_date || !body.record_type) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "record_date and record_type are required",
        }),
      };
    }

    const record = await createMedicalRecord({
      animal_id: animalId,
      record_date: body.record_date,
      record_type: body.record_type,
      notes: body.notes || null,
    });

    return {
      statusCode: 201,
      body: JSON.stringify(record),
    };
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
