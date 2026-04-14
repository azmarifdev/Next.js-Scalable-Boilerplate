export function shouldUseSecureCookies(): boolean {
  return process.env.NODE_ENV === "production" && process.env.ALLOW_INSECURE_DEV_AUTH !== "true";
}
