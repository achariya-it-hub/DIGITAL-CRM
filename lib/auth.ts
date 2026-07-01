import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "digital-crm-secret-key-2025");
const COOKIE_NAME = "crm-token";

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

export async function getUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function authenticate(email: string, password: string): Promise<JWTPayload | null> {
  const member = await prisma.user.findUnique({ where: { email } });
  if (member && member.password === password) {
    return { id: member.id, email: member.email, name: member.name, avatar: member.avatar ?? undefined, role: member.role };
  }
  return null;
}

export { COOKIE_NAME };
