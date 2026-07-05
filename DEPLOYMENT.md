# Deployment

## Required Backend Environment Variables

Set these on the backend hosting service:

- `MONGODB_URI`: MongoDB Atlas connection string.
- `JWT_SECRET`: Long random secret, at least 32 characters.
- `JWT_EXPIRATION_MS`: JWT lifetime in milliseconds, for example `86400000`.
- `CORS_ALLOWED_ORIGINS`: Comma-separated frontend origins, for example `https://your-frontend-domain.com`.
- `PORT`: Optional. Many hosts set this automatically.

## Required Frontend Environment Variables

Set this before building the frontend:

- `VITE_API_BASE_URL`: Backend API URL including `/api`, for example `https://your-backend-domain.com/api`.

## Local Build Verification

```bash
npm run build
mvn -DskipTests package
```

## Docker Builds

Backend:

```bash
docker build -t taskflow-backend .
```

Frontend:

```bash
docker build -f Dockerfile.frontend --build-arg VITE_API_BASE_URL=https://your-backend-domain.com/api -t taskflow-frontend .
```

## Render

`render.yaml` defines separate backend and frontend web services. Update these placeholder values before deploying:

- `CORS_ALLOWED_ORIGINS`
- `VITE_API_BASE_URL`
- service names or domains if your Render URLs differ
