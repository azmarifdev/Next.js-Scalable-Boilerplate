import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, USER_COOKIE_NAME } from "@/lib/constants";
import { registerSchema } from "@/modules/auth/validation";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const parsed = registerSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid registration data" }, { status: 400 });
  }

  const user = {
    id: crypto.randomUUID(),
    name: parsed.data.name,
    email: parsed.data.email
  };

  const token = `token_${crypto.randomUUID()}`;
  const response = NextResponse.json({ token, user });

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24
  });

  response.cookies.set(USER_COOKIE_NAME, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24
  });

  return response;
}
