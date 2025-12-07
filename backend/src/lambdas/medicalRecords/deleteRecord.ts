import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { deleteMedicalRecord } from "../../services/medicalRecordService";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const id = Number(event.pathParameters?.id);

    if (isNaN(id)) {
      return { statusCode: 400, body: "Invalid record ID" };
    }

    await deleteMedicalRecord(id);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Medical record deleted" }),
    };
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
