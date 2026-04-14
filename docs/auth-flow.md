# Auth Flow

## Custom Auth Provider

1. User submits `AuthForm`.
2. `modules/auth/hooks/use-auth-form.hook.ts` runs mutation via `authService`.
3. `modules/auth/services/auth.service.ts` uses `lib/auth/auth.provider.ts`.
4. `lib/auth/custom-auth.provider.ts` calls backend auth endpoints through `services/apiClient.ts`.
5. Session state is synced through `providers/auth.provider.tsx`.

## NextAuth Provider

1. `NEXT_PUBLIC_AUTH_PROVIDER=nextauth` switches active auth provider.
2. Requests flow through `src/app/api/auth/[...nextauth]/route.ts`.
3. Core NextAuth config lives in `src/lib/auth/nextauth.ts`.

## Route Guards

- Route-level protection is enforced in `src/proxy.ts`.
- Permission checks use RBAC utilities in `src/lib/auth/rbac.ts`.
