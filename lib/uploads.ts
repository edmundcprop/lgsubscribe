import fs from "fs";
import path from "path";
import { getStore } from "@netlify/blobs";

const STORE_NAME = "uploads";

function onNetlify(): boolean {
  return process.env.NETLIFY === "true";
}

function inferContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    avif: "image/avif",
  };
  return map[ext] ?? "application/octet-stream";
}

export async function saveUpload(
  filename: string,
  data: Buffer,
  contentType: string
): Promise<{ url: string }> {
  if (!onNetlify()) {
    const dir = path.join(process.cwd(), "public", "uploads");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), data);
    return { url: `/uploads/${filename}` };
  }

  const store = getStore(STORE_NAME);
  const ab = data.buffer.slice(
    data.byteOffset,
    data.byteOffset + data.byteLength
  ) as ArrayBuffer;
  await store.set(filename, ab, { metadata: { contentType } });
  return { url: `/api/uploads/${filename}` };
}

export async function getUpload(
  filename: string
): Promise<{ data: ArrayBuffer; contentType: string } | null> {
  if (!onNetlify()) {
    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    if (!fs.existsSync(filePath)) return null;
    const buffer = fs.readFileSync(filePath);
    const ab = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );
    return { data: ab, contentType: inferContentType(filename) };
  }

  const store = getStore(STORE_NAME);
  const result = await store.getWithMetadata(filename, { type: "arrayBuffer" });
  if (!result) return null;
  const metaCT =
    typeof result.metadata?.contentType === "string"
      ? result.metadata.contentType
      : undefined;
  return {
    data: result.data as ArrayBuffer,
    contentType: metaCT ?? inferContentType(filename),
  };
}
