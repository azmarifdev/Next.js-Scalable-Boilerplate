import { NextRequest } from "next/server";

import { appConfig } from "@/lib/config/app-config";

async function nextAuthDisabledResponse(): Promise<Response> {
  return new Response("Not Found", { status: 404 });
}

export async function GET(request: NextRequest): Promise<Response> {
  if (appConfig.authProvider !== "nextauth") {
    return nextAuthDisabledResponse();
  }

  const { handlers } = await import("@/lib/auth/nextauth");
  return handlers.GET(request);
}

export async function POST(request: NextRequest): Promise<Response> {
  if (appConfig.authProvider !== "nextauth") {
    return nextAuthDisabledResponse();
  }

  const { handlers } = await import("@/lib/auth/nextauth");
  return handlers.POST(request);
}
