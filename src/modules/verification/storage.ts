import { createClient } from "@supabase/supabase-js";

export async function uploadProof(file: Express.Multer.File, inventoryId: string): Promise<string> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_PROOF_BUCKET ?? "verification-proofs";
  if (!url || !key) throw new Error("Supabase storage is not configured");

  const client = createClient(url, key);
  const path = `${inventoryId}/${Date.now()}-${file.originalname}`;
  const { error } = await client.storage.from(bucket).upload(path, file.buffer, { contentType: file.mimetype, upsert: false });
  if (error) throw new Error(`Proof upload failed: ${error.message}`);
  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
