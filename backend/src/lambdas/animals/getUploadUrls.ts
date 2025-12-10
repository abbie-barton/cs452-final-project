import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({ region: "us-east-2" });

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };

  try {
    const { animal_id, files } = JSON.parse(event.body || "{}");

    if (!animal_id || !files || !Array.isArray(files)) {
      return { statusCode: 400, headers, body: "animal_id and files required" };
    }

    const bucket = process.env.BUCKET_NAME!;

    const urls = await Promise.all(
      files.map(async (file: { fileName: string; fileType: string }) => {
        const key = `animals/${animal_id}/${uuidv4()}-${file.fileName}`;

        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          ContentType: file.fileType,
        });

        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

        return {
          fileName: file.fileName,
          uploadUrl,
          publicUrl: `https://${bucket}.s3.amazonaws.com/${key}`,
        };
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ urls }),
    };

  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
