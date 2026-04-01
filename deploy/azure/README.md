# Azure Deployment

Recommended options:

- Azure Container Apps
- Azure App Service (custom container)

## Minimum flow

1. Build image from `Dockerfile`.
2. Push to Azure Container Registry (ACR).
3. Deploy container app/service with exposed port `3000`.
4. Configure environment variables in Azure portal.
5. Attach custom domain and managed certificate.

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
