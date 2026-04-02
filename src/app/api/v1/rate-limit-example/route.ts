import { withApiHandler } from "@/lib/api-handler";
import { apiError, apiSuccess, resolveRequestId } from "@/lib/api-response";
import { attachRateLimitHeaders, consumeRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT = {
  limit: 5,
  windowMs: 60_000
};

async function rateLimitExampleHandler(request: Request): Promise<Response> {
  const requestId = resolveRequestId(request.headers);
  const sourceIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const result = consumeRateLimit(`example:${sourceIp}`, RATE_LIMIT);

  if (!result.allowed) {
    const response = apiError(
      { code: "RATE_LIMITED", message: "Rate limit exceeded for this endpoint" },
      { status: 429, requestId, route: "/api/v1/rate-limit-example" }
    );
    attachRateLimitHeaders(response, result, RATE_LIMIT.limit);
    return response;
  }

  const response = apiSuccess(
    {
      message: "Request accepted",
      remaining: result.remaining
    },
    { requestId }
  );
  attachRateLimitHeaders(response, result, RATE_LIMIT.limit);
  return response;
}

export const GET = withApiHandler("/api/v1/rate-limit-example", rateLimitExampleHandler);
