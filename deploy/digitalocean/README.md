# DigitalOcean Deployment

Recommended options:

- App Platform (easiest)
- Droplet + Docker

## Minimum flow (App Platform)

1. Connect GitHub repository.
2. Build using Dockerfile or buildpack.
3. Set run command to `npm run start` and port `3000`.
4. Configure environment variables from `.env.example` keys.
5. Attach custom domain and TLS.

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
