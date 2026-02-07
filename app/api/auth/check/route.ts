import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();

    return NextResponse.json({
      isAdmin: session.isAdmin || false,
      username: session.username || null,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { isAdmin: false, username: null },
      { status: 200 }
    );
  }
}
