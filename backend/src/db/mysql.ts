import mysql from "mysql2/promise";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const sm = new SecretsManagerClient({});

let cachedPool: mysql.Pool | null = null;

async function getSecret() {
  const res = await sm.send(
    new GetSecretValueCommand({
      SecretId: process.env.DB_SECRET_NAME,
    })
  );

  if (!res.SecretString) throw new Error("Secret not found");

  return JSON.parse(res.SecretString);
}

export async function getPool() {
  if (cachedPool) return cachedPool;

  const secret = await getSecret();

  cachedPool = mysql.createPool({
    host: process.env.DB_HOST,        // RDS endpoint from CDK
    user: secret.username,           // from Secrets Manager
    password: secret.password,       // from Secrets Manager
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
  });

  return cachedPool;
}
