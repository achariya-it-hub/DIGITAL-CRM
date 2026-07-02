import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signToken, verifyToken, COOKIE_NAME } from "./jwt";
import type { JWTPayload } from "./jwt";

export { signToken, verifyToken, COOKIE_NAME };
export type { JWTPayload };


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

