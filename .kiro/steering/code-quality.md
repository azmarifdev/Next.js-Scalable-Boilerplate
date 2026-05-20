# Code Quality Steering

- Prefer typed APIs and explicit runtime validation
- Keep auth changes covered by integration tests
- Enforce lint + typecheck + test + build before release
- Avoid disabling lint/type checks to bypass failures
- Keep server/client boundaries intentional ("use client" only when needed)
