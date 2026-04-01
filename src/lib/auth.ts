import { jwtVerify, SignJWT } from "jose";

interface SessionPayload {
  role: "admin" | "participant";
  email?: string;
  registrationNumber?: string;
  rowIndex?: number; // Optimization: store the row index to quickly update/fetch their specific row later
}

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "fallback_super_secret_for_dev_only";
const encodedKey = new TextEncoder().encode(JWT_SECRET_KEY);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // 1 week session
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    console.error("Failed to verify session", error);
    return null;
  }
}
