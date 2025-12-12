import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET =
  process.env.JWT_SECRET || "fallback-secret-key-change-in-production";

export interface TokenPayload {
  adminId: string;
  username: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getAdminFromToken(): Promise<TokenPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token) {
      return null;
    }

    return verifyToken(token);
  } catch (error) {
    return null;
  }
}

export function setAdminCookie(payload: TokenPayload): string {
  const token = generateToken(payload);

  return `admin-token=${token}; HttpOnly; Path=/; Max-Age=${
    7 * 24 * 60 * 60
  }; SameSite=strict`;
}
