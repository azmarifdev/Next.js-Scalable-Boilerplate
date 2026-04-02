# Auth Flow

## Custom Auth (Default)

1. User submits login/register form.
2. `modules/auth/hooks/useAuthForm.ts` triggers auth mutation.
3. `modules/auth/services/custom-auth.service.ts` calls API layer.
4. API returns standardized `ApiResponse<T>`.
5. Session cookie is set (HTTP-only) for internal mode, or handled by external backend.
6. `AuthProvider` resolves current user (`/auth/me`) with TanStack Query.
7. RBAC checks are enforced by proxy and server guards.

## NextAuth (Optional)

- Set `NEXT_PUBLIC_AUTH_PROVIDER=nextauth`.
- Enable NextAuth route at `src/app/api/auth/[...nextauth]/route.ts`.
- Credentials provider is available by default.
- Google provider is enabled automatically when credentials are configured.

## Refresh Token

- Custom auth includes `POST /api/v1/auth/refresh`.
- The endpoint rotates session token and extends expiry.

## RBAC

- Roles: `admin`, `user`.
- Permissions are enforced in:
  - `src/proxy.ts` (route-level)
  - `src/lib/auth/session-guard.ts` (API-level)
  - UI rendering (navigation and feature visibility)
