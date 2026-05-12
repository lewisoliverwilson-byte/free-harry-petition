import { DynamoDBClient, ScanCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";

const db = new DynamoDBClient({ region: process.env.AWS_REGION });
const TABLE = "petition-signatures";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

const json = (statusCode, body) => ({
  statusCode,
  headers: { ...CORS, "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  const method = event.requestContext?.http?.method ?? "GET";

  if (method === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };

  if (method === "GET") {
    const { Items = [] } = await db.send(new ScanCommand({ TableName: TABLE }));
    const signatures = Items
      .map(i => ({
        id: i.id.S,
        name: i.name.S,
        signed_at: i.signed_at.S,
        reason: i.reason?.S ?? null,
        photo: i.photo?.S ?? null,
        type: i.type?.S ?? "against",
      }))
      .sort((a, b) => new Date(b.signed_at) - new Date(a.signed_at));
    return json(200, signatures);
  }

  if (method === "POST") {
    const { name, reason, photo, type } = JSON.parse(event.body ?? "{}");
    if (!name?.trim()) return json(400, { error: "Name is required" });

    const itemType = type === "pro" ? "pro" : "against";

    const item = {
      id: randomUUID(),
      name: name.trim(),
      signed_at: new Date().toISOString(),
      type: itemType,
      ...(reason?.trim() && { reason: reason.trim() }),
      ...(photo && { photo }),
    };

    const dbItem = {
      id: { S: item.id },
      name: { S: item.name },
      signed_at: { S: item.signed_at },
      type: { S: item.type },
      ...(item.reason && { reason: { S: item.reason } }),
      ...(item.photo && { photo: { S: item.photo } }),
    };

    await db.send(new PutItemCommand({ TableName: TABLE, Item: dbItem }));
    return json(201, item);
  }

  return json(405, { error: "Method not allowed" });
};
