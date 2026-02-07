import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Input validation
    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Limit username and password length
    if (username.length > 100 || password.length > 100) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Rate limiting - 5 attempts per 15 minutes per IP
    const clientIp = request.headers.get("x-forwarded-for") ||
                     request.headers.get("x-real-ip") ||
                     "unknown";
    const rateLimitResult = await rateLimit(`login:${clientIp}`, 5, 900);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many login attempts. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000))
          }
        }
      );
    }

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPasswordHashBase64 = process.env.ADMIN_PASSWORD_HASH_BASE64;

    if (!adminUsername || !adminPasswordHashBase64) {
      console.error('Missing env vars!');
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Decode the base64 hash
    const adminPasswordHash = Buffer.from(adminPasswordHashBase64, 'base64').toString('utf-8');

    // Always compare password even if username doesn't match to prevent timing attacks
    const isUsernameValid = username === adminUsername;
    const isPasswordValid = await bcrypt.compare(password, adminPasswordHash);

    if (!isUsernameValid || !isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const session = await getSession();
    session.isAdmin = true;
    session.username = username;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
