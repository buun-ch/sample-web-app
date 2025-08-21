# sample-web-app

An example ToDo Application built with Next.js + Drizzle ORM + PostgreSQL

## Overview

This is a an example ToDo application built with Next.js 15.4 and Drizzle ORM. It leverages Server Actions for server-side operations and PostgreSQL for data persistence.

## Tech Stack

- **Framework**: Next.js 15.4.7 (App Router)
- **Language**: TypeScript
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm

## Features

- ✅ Add new todos
- ✅ Toggle todo completion status
- ✅ Edit todo text (click to edit)
- ✅ Delete todos
- ✅ Display remaining task count

## Setup

### Prerequisites

- Node.js 22.18 or higher
- pnpm
- PostgreSQL server

### Installation

#### Clone the repository

```bash
git clone <repository-url>
cd sample-web-app
```

#### Install dependencies

```bash
pnpm install
```

#### Configure environment variables

Create a `.env.local` file and set your PostgreSQL connection string:

```env
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
```

Example:

```env
DATABASE_URL=postgresql://todo:todopass@localhost:5432/todo
```

#### Set up the database

Push the schema to your database:

```bash
pnpm db:push
```

Or generate and run migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

#### Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Development with Tilt

[Tilt](https://tilt.dev/) provides a powerful development environment with hot reloading and automatic rebuilds.

#### Prerequisites for Tilt

- [Tilt](https://docs.tilt.dev/install.html) installed
- Local Kubernetes cluster (Docker Desktop, minikube, kind, k3d, or Rancher Desktop)
- kubectl configured to access your cluster

#### Starting Development with Tilt

Start Tilt by running:

```bash
tilt up -- --registry ghcr.io/your-username
```

If you do not specify a registry, Tilt will use the default registry `localhost:30500`.

If the registry requires authentication, create a secret in your Kubernetes cluster:

```bash
kubectl create secret docker-registry regcred \
  --docker-server=ghcr.io \
  --docker-username=<your-username> \
  --docker-password=<your-github-token> \
  --docker-email=<your-email>
```

(This is an example for GitHub Container Registry; adjust for your registry.)

Then create a `values-dev.yaml` file in the root directory with the following content:

```yaml
imagePullSecrets:
  - name: regcred
```

Run Tilt with the custom values file:

```bash
tilt up -- --registry ghcr.io/your-username --extra-values-file values-dev.yaml
```

You can also specify the port forwarding option to access the app locally:

```bash
tilt up -- --registry ghcr.io/your-username --port-forward
```

Then open the URL: `http://localhost:13000`.

If you use Telepresence, you can run:

```bash
tilt up -- --registry ghcr.io/your-username
```

Then enable Telepresence connectivity:

```bash
telepresence connect
```

and open the URL: `http://sample-web-app-tilt.sample-web-app.svc:3000`.

#### Customizing Tilt Development

Edit `values-dev.yaml` to customize your development environment:

- Environment variables
- Resource limits
- Database connections

To deploy PostgreSQL alongside your app, uncomment the PostgreSQL section in `Tiltfile`.

#### Stopping Tilt

Press `Ctrl+C` in the terminal or run:

```bash
tilt down
```

## Available Scripts

```bash
# Development server (with Turbopack)
pnpm dev

# Production build
pnpm build

# Production server
pnpm start

# Lint code
pnpm lint

# Drizzle commands
pnpm db:generate  # Generate migration files
pnpm db:migrate   # Run migrations
pnpm db:push      # Push schema directly to database
pnpm db:studio    # Open Drizzle Studio (GUI for database)
```

## Project Structure

```plain
sample-web-app/
├── app/                   # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (ToDo app)
│   └── globals.css        # Global styles
├── src/
│   ├── actions/           # Server Actions
│   │   └── todoActions.ts # ToDo CRUD operations
│   ├── components/        # React components
│   │   ├── TodoList.tsx   # ToDo list container
│   │   ├── TodoItem.tsx   # Individual todo item
│   │   └── AddTodo.tsx    # Add todo form
│   └── db/                # Database related
│       ├── schema.ts      # Drizzle schema definition
│       └── index.ts       # Database connection
├── drizzle/               # Migration files
├── drizzle.config.ts      # Drizzle configuration
└── .env.local             # Environment variables
```

## Database Schema

```typescript
todos {
  id: serial (primary key)
  text: text (not null)
  done: boolean (default: false)
  createdAt: timestamp (default: now)
  updatedAt: timestamp (default: now)
}
```

## Docker

### Building Container Images

#### Production Image

Build the production image:

```bash
docker build -t sample-web-app:latest .
```

Run the production container:

```bash
docker run -d \
  --name sample-web-app \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://todo:todopass@host.docker.internal:5432/todo" \
  sample-web-app:latest
```

#### Development Image

Build the development image:

```bash
docker build -f Dockerfile.dev -t sample-web-app:dev .
```

Run the development container with hot reload:

```bash
docker run -d \
  --name sample-web-app-dev \
  -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -v /app/.next \
  -e DATABASE_URL="postgresql://todo:todopass@host.docker.internal:5432/todo" \
  sample-web-app:dev
```

### Environment Variables

When running containers, set the `DATABASE_URL` environment variable.

## Deployment

### Standard Deployment

Build for production with `pnpm build` and start with `pnpm start`.

### Container Deployment

1. Build the production image: `docker build -t sample-web-app:latest .`
2. Push to your container registry
3. Deploy to your container platform (Kubernetes, ECS, Cloud Run, etc.)

Here is an example for pushing images to GHCR (GitHub Container Registry):

```bash
docker build -t ghcr.io/yourusername/sample-web-app:latest .
docker push ghcr.io/yourusername/sample-web-app:latest

docker build -f Dockerfile.dev -t ghcr.io/yourusername/sample-web-app:dev .
docker push ghcr.io/yourusername/sample-web-app:dev
```

Then you can deploy it using your preferred container orchestration platform.

### Helm Deployment (Kubernetes)

A Helm chart is included in `charts/sample-web-app` for Kubernetes deployment.

#### Helm Prerequisites

- Kubernetes cluster
- Helm 3.x installed
- kubectl configured

#### Basic Deployment

1. Create a namespace (optional):

```bash
kubectl create namespace sample-web-app
```

2. Create image pull secret if using private registry:

```bash
kubectl create secret docker-registry regcred \
  --docker-server=ghcr.io \
  --docker-username=<your-username> \
  --docker-password=<your-github-token> \
  --docker-email=<your-email> \
  -n sample-web-app
```

3. Create a `values.yaml` file with your configuration:

```yaml
# Example values.yaml
image:
  imageRegistry: ghcr.io/yourusername
  repository: sample-web-app
  tag: latest
  pullPolicy: IfNotPresent

imagePullSecrets:
  - name: regcred

env:
  - name: DATABASE_URL
    value: "postgresql://todo:todopass@postgres-cluster-rw.postgres:5432/todo"

ingress:
  enabled: true
  ingressClassName: traefik
  hosts:
    - host: sample.yourdomain.com
      paths:
        - path: /
          pathType: ImplementationSpecific
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
  tls:
    - hosts:
        - sample.yourdomain.com
```

4. Deploy using Helm:

```bash
helm upgrade --install sample-web-app ./charts/sample-web-app \
    -n sample-web-app --wait -f values.yaml
```

#### Advanced Configuration

You can also use ConfigMaps or Secrets for environment variables:

```yaml
# Using Secret for DATABASE_URL
envFrom:
  - secretRef:
      name: app-secrets
```

Create the secret separately:

```bash
kubectl create secret generic app-secrets \
    --from-literal=DATABASE_URL="postgresql://todo:todopass@postgres:5432/todo" \
    -n sample-web-app
```

#### Verify Deployment

```bash
# Check pods
kubectl get pods -n sample-web-app

# Check service
kubectl get svc -n sample-web-app

# View logs
kubectl logs -n sample-web-app deployment/sample-web-app
```

#### Uninstall

```bash
helm uninstall sample-web-app -n sample-web-app
```

## License

MIT
