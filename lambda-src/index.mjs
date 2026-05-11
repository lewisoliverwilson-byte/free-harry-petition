import { DynamoDBClient, ScanCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";

const db = new DynamoDBClient({ region: process.env.AWS_REGION });
const TABLE = "petition-signatures";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

const json = (statusCode, body, extra = {}) => ({
  statusCode,
  headers: { ...CORS, "Content-Type": "application/json", ...extra },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  const method = event.requestContext?.http?.method ?? "GET";

  if (method === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };

  if (method === "GET") {
    const { Items = [] } = await db.send(new ScanCommand({ TableName: TABLE }));
    const signatures = Items
      .map(i => ({ id: i.id.S, name: i.name.S, signed_at: i.signed_at.S }))
      .sort((a, b) => new Date(b.signed_at) - new Date(a.signed_at));
    return json(200, signatures);
  }

  if (method === "POST") {
    const { name } = JSON.parse(event.body ?? "{}");
    if (!name?.trim()) return json(400, { error: "Name is required" });
    const item = { id: randomUUID(), name: name.trim(), signed_at: new Date().toISOString() };
    await db.send(new PutItemCommand({
      TableName: TABLE,
      Item: { id: { S: item.id }, name: { S: item.name }, signed_at: { S: item.signed_at } },
    }));
    return json(201, item);
  }

  return json(405, { error: "Method not allowed" });
};
