# Folder Structure

```txt
src/
  app/
    (auth)/
    (dashboard)/
    api/
  components/
    common/
    layout/
    ui/
  hooks/
  i18n/
  lib/
    api/
    auth/
    config/
    db/
      providers/
    errors/
    observability/
    security/
  modules/
    auth/
      components/
      hooks/
      services/
      types.ts
      validation.ts
    user/
      components/
      hooks/
      services/
      types.ts
      validation.ts
    project/
      components/
      hooks/
      services/
      types.ts
      validation.ts
    task/
      components/
      hooks/
      services/
      types.ts
      validation.ts
    ecommerce/
      components/
      hooks/
      services/
      types.ts
      validation.ts
    billing/
      components/
      hooks/
      services/
      types.ts
      validation.ts
  providers/
  services/
    apiClient.ts
    rest/
    graphql/
  store/
  styles/
  tests/
```

## Rules

- Business logic must stay inside `modules/*`.
- Shared transport logic belongs in `services/*`.
- Reusable UI belongs in `components/*`.
- Global app internals belong in `lib/*`.
