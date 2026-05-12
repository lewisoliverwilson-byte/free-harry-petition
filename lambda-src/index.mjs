import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { RekognitionClient, DetectFacesCommand } from "@aws-sdk/client-rekognition";
import { randomUUID } from "crypto";

const db  = new DynamoDBClient({ region: process.env.AWS_REGION });
const rek = new RekognitionClient({ region: process.env.AWS_REGION });
const TABLE = "petition-signatures";
const CLICKS_KEY = "__clicks__";

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

async function detectFacePosition(dataUrl) {
  try {
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    const bytes = Buffer.from(base64, "base64");
    const { FaceDetails = [] } = await rek.send(new DetectFacesCommand({
      Image: { Bytes: bytes },
    }));
    if (!FaceDetails.length) return null;
    const face = FaceDetails.sort(
      (a, b) =>
        b.BoundingBox.Width * b.BoundingBox.Height -
        a.BoundingBox.Width * a.BoundingBox.Height
    )[0];
    const cx = Math.round((face.BoundingBox.Left + face.BoundingBox.Width / 2) * 100);
    const cy = Math.round((face.BoundingBox.Top + face.BoundingBox.Height / 2) * 100);
    return `${cx}% ${cy}%`;
  } catch {
    return null;
  }
}

export const handler = async (event) => {
  const method = event.requestContext?.http?.method ?? "GET";
  const path   = event.rawPath ?? "/";

  if (method === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };

  // ── /clicks ──────────────────────────────────────────────────────────────
  if (path.endsWith("/clicks")) {
    if (method === "GET") {
      const { Item } = await db.send(new GetItemCommand({
        TableName: TABLE,
        Key: { id: { S: CLICKS_KEY } },
      }));
      return json(200, { count: parseInt(Item?.count?.N ?? "0", 10) });
    }

    if (method === "POST") {
      const { Attributes } = await db.send(new UpdateItemCommand({
        TableName: TABLE,
        Key: { id: { S: CLICKS_KEY } },
        UpdateExpression: "ADD #n :one",
        ExpressionAttributeNames: { "#n": "count" },
        ExpressionAttributeValues: { ":one": { N: "1" } },
        ReturnValues: "UPDATED_NEW",
      }));
      return json(200, { count: parseInt(Attributes.count.N, 10) });
    }
  }

  // ── /signatures ───────────────────────────────────────────────────────────
  if (method === "GET") {
    const { Items = [] } = await db.send(new ScanCommand({ TableName: TABLE }));
    const signatures = Items
      .filter(i => i.id.S !== CLICKS_KEY)
      .map(i => ({
        id: i.id.S,
        name: i.name.S,
        signed_at: i.signed_at.S,
        reason: i.reason?.S ?? null,
        photo: i.photo?.S ?? null,
        photo_position: i.photo_position?.S ?? null,
        type: i.type?.S ?? "against",
      }))
      .sort((a, b) => new Date(b.signed_at) - new Date(a.signed_at));
    return json(200, signatures);
  }

  if (method === "POST") {
    const { name, reason, photo, type } = JSON.parse(event.body ?? "{}");
    if (!name?.trim()) return json(400, { error: "Name is required" });

    const itemType = type === "pro" ? "pro" : "against";
    const photoPosition = photo ? await detectFacePosition(photo) : null;

    const item = {
      id: randomUUID(),
      name: name.trim(),
      signed_at: new Date().toISOString(),
      type: itemType,
      ...(reason?.trim() && { reason: reason.trim() }),
      ...(photo && { photo }),
      ...(photoPosition && { photo_position: photoPosition }),
    };

    const dbItem = {
      id: { S: item.id },
      name: { S: item.name },
      signed_at: { S: item.signed_at },
      type: { S: item.type },
      ...(item.reason && { reason: { S: item.reason } }),
      ...(item.photo && { photo: { S: item.photo } }),
      ...(item.photo_position && { photo_position: { S: item.photo_position } }),
    };

    await db.send(new PutItemCommand({ TableName: TABLE, Item: dbItem }));
    return json(201, item);
  }

  return json(405, { error: "Method not allowed" });
};
