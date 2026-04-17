import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  return process.env.JWT_SECRET || "lg-subscribe-cms-dev-secret-2024";
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(payload: {
  id: string;
  username: string;
  role: string;
}): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "24h" });
}

export function verifyToken(
  token: string
): { id: string; username: string; role: string } | null {
  try {
    return jwt.verify(token, getJwtSecret()) as {
      id: string;
      username: string;
      role: string;
    };
  } catch {
    return null;
  }
}

export function getTokenFromCookies(req: Request): string | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const match = cookie.match(/(?:^|;\s*)cms_token=([^;]*)/);
  return match ? match[1] : null;
}
