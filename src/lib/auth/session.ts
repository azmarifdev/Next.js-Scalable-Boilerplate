interface SessionPayload {
  sub: string;
  name: string;
  email: string;
  role: "admin" | "user";
  mfaVerified?: boolean;
  mfaVerifiedAt?: number;
  iat: number;
  exp: number;
}

interface SessionHeader {
  alg: "HS256";
  typ: "AST";
  kid: string;
}

interface SessionKey {
  kid: string;
  value: string;
}

const DEV_FALLBACK_SECRET = "dev-only-insecure-session-secret";

function uint8ToBase64Url(bytes: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToUint8(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const bin = atob(padded);
  return Uint8Array.from(bin, (char) => char.charCodeAt(0));
}

function tryBase64UrlToUint8(base64Url: string): Uint8Array | null {
  try {
    return base64UrlToUint8(base64Url);
  } catch {
    return null;
  }
}

function getSessionKeys(): SessionKey[] {
  const fromList = (process.env.AUTH_SESSION_SECRETS ?? "")
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean)
    .map((value, index) => ({ kid: `k${index + 1}`, value }));

  if (fromList.length > 0) {
    return fromList;
  }

  const legacy = process.env.AUTH_SESSION_SECRET;
  if (legacy) {
    return [{ kid: "k1", value: legacy }];
  }

  const allowInsecureDevFallback = process.env.ALLOW_INSECURE_DEV_AUTH === "true";
  if (!allowInsecureDevFallback) {
    throw new Error(
      "AUTH_SESSION_SECRET or AUTH_SESSION_SECRETS is required. For local-only fallback set ALLOW_INSECURE_DEV_AUTH=true."
    );
  }

  return [{ kid: "dev-k1", value: DEV_FALLBACK_SECRET }];
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let diff = 0;
  for (let index = 0; index < a.length; index += 1) {
    diff |= a[index] ^ b[index];
  }

  return diff === 0;
}

async function sign(input: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(input));
  return uint8ToBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(
  user: Pick<SessionPayload, "sub" | "name" | "email" | "role" | "mfaVerified" | "mfaVerifiedAt">,
  ttlSeconds: number
): Promise<string> {
  const keys = getSessionKeys();
  const activeKey = keys[0];
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    ...user,
    iat: now,
    exp: now + ttlSeconds
  };
  const header: SessionHeader = {
    alg: "HS256",
    typ: "AST",
    kid: activeKey.kid
  };

  const encodedHeader = uint8ToBase64Url(new TextEncoder().encode(JSON.stringify(header)));
  const encodedPayload = uint8ToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = await sign(signingInput, activeKey.value);

  return `${signingInput}.${signature}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  const [encodedHeader, encodedPayload, providedSignature] = token.split(".");
  if (!encodedHeader || !encodedPayload || !providedSignature) {
    return null;
  }

  let header: SessionHeader;
  try {
    header = JSON.parse(new TextDecoder().decode(base64UrlToUint8(encodedHeader)));
  } catch {
    return null;
  }

  if (header.alg !== "HS256" || header.typ !== "AST" || typeof header.kid !== "string") {
    return null;
  }

  const keys = getSessionKeys();
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const keyCandidates = keys.filter((key) => key.kid === header.kid);
  const candidates = keyCandidates.length > 0 ? keyCandidates : keys;
  const providedSignatureBytes = tryBase64UrlToUint8(providedSignature);
  if (!providedSignatureBytes) {
    return null;
  }

  let signatureValid = false;
  for (const candidate of candidates) {
    const expectedSignature = await sign(signingInput, candidate.value);
    const expectedSignatureBytes = tryBase64UrlToUint8(expectedSignature);
    if (!expectedSignatureBytes) {
      continue;
    }

    signatureValid = timingSafeEqualBytes(expectedSignatureBytes, providedSignatureBytes);
    if (signatureValid) {
      break;
    }
  }

  if (!signatureValid) {
    return null;
  }

  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToUint8(encodedPayload)));

    if (
      typeof payload.sub !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.email !== "string" ||
      (payload.role !== "admin" && payload.role !== "user") ||
      (payload.mfaVerified !== undefined && typeof payload.mfaVerified !== "boolean") ||
      (payload.mfaVerifiedAt !== undefined && typeof payload.mfaVerifiedAt !== "number") ||
      typeof payload.iat !== "number" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}
