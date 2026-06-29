/**
 * Tiny Upstash Redis (Vercel KV) client over the REST API — no SDK needed.
 * Reads whichever env vars the Vercel KV / Upstash integration injected.
 */
const URL =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

export function storeConfigured() {
  return Boolean(URL && TOKEN);
}

async function cmd<T = unknown>(args: (string | number)[]): Promise<T> {
  if (!URL || !TOKEN) throw new Error("KV store not configured");
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.result as T;
}

export const store = {
  rpush: (key: string, ...vals: string[]) =>
    cmd<number>(["RPUSH", key, ...vals]),
  lpop: (key: string) => cmd<string | null>(["LPOP", key]),
  llen: (key: string) => cmd<number>(["LLEN", key]),
  get: (key: string) => cmd<string | null>(["GET", key]),
  set: (key: string, val: string) => cmd<string>(["SET", key, val]),
  setnx: (key: string, val: string) => cmd<number>(["SETNX", key, val]),
};
