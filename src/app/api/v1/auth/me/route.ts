import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { USER_COOKIE_NAME } from "@/lib/constants";
import { User } from "@/types/user";

export async function GET() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get(USER_COOKIE_NAME)?.value;

  if (!userCookie) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = JSON.parse(userCookie) as User;
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ message: "Invalid session" }, { status: 401 });
  }
}
