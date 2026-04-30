const ADMIN_STEP_UP_ROUTES = ["/users"];

export function isAdminStepUpEnabled(): boolean {
  return process.env.REQUIRE_ADMIN_STEP_UP_AUTH === "true";
}

export function isAdminStepUpRoute(pathname: string): boolean {
  return ADMIN_STEP_UP_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
