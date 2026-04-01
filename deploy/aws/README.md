# AWS Deployment

Recommended options:

- ECS Fargate (container-first)
- App Runner (simple container deploy)
- EC2 with Docker

## Minimum flow (ECS/App Runner)

1. Build image from `Dockerfile`.
2. Push image to ECR.
3. Create service using container port `3000`.
4. Set environment variables from `.env.example` keys.
5. Add domain + TLS (ACM/Route53).

## Required env vars (typical)

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `DATABASE_URL`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_*` values as needed

## Health

Use: `/api/v1/health`
