import { withApiHandler } from "@/lib/api-handler";
import { apiSuccess, resolveRequestId } from "@/lib/api-response";

export const runtime = "edge";

async function healthHandler(request: Request): Promise<Response> {
  const requestId = resolveRequestId(request.headers);
  return apiSuccess(
    {
      status: "ok",
      runtime: "edge",
      timestamp: new Date().toISOString()
    },
    { requestId }
  );
}

export const GET = withApiHandler("/api/v1/health", healthHandler);
