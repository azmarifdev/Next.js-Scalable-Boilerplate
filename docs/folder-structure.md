# Folder Structure

```txt
src/
  app/
    (auth)/
    (dashboard)/
    api/
      auth/
      v1/
        auth/
  components/
    common/
    layout/
    ui/
  hooks/
  i18n/
  lib/
    auth/
    config/
    db/
      providers/
    errors/
    observability/
    security/
    utils/
  modules/
    auth/
      components/
      hooks/
      services/
      auth.types.ts
      auth.validation.ts
    user/
      components/
      hooks/
      services/
      user.types.ts
      user.validation.ts
    project/
      components/
      hooks/
      services/
      project.types.ts
      project.validation.ts
    task/
      components/
      hooks/
      services/
      task.types.ts
      task.validation.ts
    ecommerce/
      components/
      hooks/
      services/
      ecommerce.types.ts
      ecommerce.validation.ts
    billing/
      components/
      hooks/
      services/
      billing.types.ts
      billing.validation.ts
  providers/
    index.tsx
    *.provider.tsx
  services/
    apiClient.ts
    rest/
    graphql/
  store/
  styles/
  tests/
```

## Conventions

- `*.service.ts` for service layer files
- `*.hook.ts` for hooks
- `*.validation.ts` for schemas
- `*.types.ts` for types
- `*.provider.tsx` for React providers

## Boundary Summary

- `modules` can call `services`.
- `services` can call transport clients.
- `components` stay reusable and feature-agnostic.
- `lib` contains platform/system internals only.
