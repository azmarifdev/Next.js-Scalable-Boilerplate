# Cloud Provider Notes

This boilerplate ships with a Docker-first deployment model.

Use these notes as starting points when running the same container on managed cloud platforms.

## AWS

Recommended services:

- ECS Fargate
- App Runner
- EC2 with Docker

Typical flow:

1. Build image from `Dockerfile`.
2. Push image to ECR.
3. Run container on port `3000`.
4. Configure environment variables from `.env.example`.
5. Attach domain and TLS.

## Azure

Recommended services:

- Azure Container Apps
- Azure App Service (custom container)

Typical flow:

1. Build image from `Dockerfile`.
2. Push image to Azure Container Registry.
3. Run container on port `3000`.
4. Configure environment variables from `.env.example`.
5. Attach domain and TLS.

## DigitalOcean

Recommended services:

- App Platform
- Droplet with Docker

Typical flow:

1. Build image from `Dockerfile`.
2. Deploy container and expose port `3000`.
3. Configure environment variables from `.env.example`.
4. Attach domain and TLS.
