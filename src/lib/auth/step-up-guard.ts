import { apiError } from "@/lib/utils/api-response";

export function requireAdminStepUp(options: {
  role: "admin" | "user";
  mfaVerified?: boolean;
  requestId?: string;
  route?: string;
}): ReturnType<typeof apiError> | null {
  if (options.role !== "admin") {
    return null;
  }

  if (options.mfaVerified) {
    return null;
  }

  return apiError(
    {
      code: "MFA_REQUIRED",
      message: "Admin step-up authentication is required for this resource"
    },
    { status: 403, requestId: options.requestId, route: options.route }
  );
}
