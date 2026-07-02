import { SignJWT, jwtVerify } from "jose";

export const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "digital-crm-secret-key-2025");
export const COOKIE_NAME = "crm-token";

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}
