# Database Migration Strategy

## Overview

This document describes the database migration strategy for the sample-web-app in Kubernetes environments.

## Migration Methods

### 1. Init Container (Development/Staging)

For development and staging environments, we use init containers that run before the main application container starts.

**Pros:**

- Simple to implement
- Runs automatically with each pod deployment
- Good for development where frequent schema changes occur

**Cons:**

- Runs on every pod start (can cause race conditions with multiple replicas)
- Not suitable for production with multiple replicas

**Configuration (values-dev.yaml):**

```yaml
migration:
  enabled: true
  useAppImage: true

initContainers:
  - name: db-migrate
    # ... migration configuration
```

### 2. Helm Hook Job (Production)

For production environments, we use Kubernetes Jobs triggered by Helm hooks.

**Pros:**

- Runs only once during deployment
- No race conditions
- Can be rolled back if migration fails
- Proper for production environments

**Cons:**

- More complex setup
- Requires Helm for deployment

**Configuration (values-prod.yaml):**

```yaml
migration:
  enabled: true
  runAsJob: true  # This triggers Job instead of init container
  useAppImage: true
```

## Best Practices for Production

### 1. Use Kubernetes Jobs with Helm Hooks

```yaml
annotations:
  "helm.sh/hook": pre-install,pre-upgrade
  "helm.sh/hook-weight": "-5"
  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

This ensures:

- Migration runs before application deployment
- Old migration jobs are cleaned up
- Failed migrations prevent deployment

### 2. Separate Database Credentials

Store database credentials in Kubernetes Secrets:

```yaml
env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: db-credentials
        key: database-url
```

### 3. Use Dedicated Migration Tools

For complex migrations, consider:

- **Prisma Migrate**: Built-in migration system with `prisma migrate deploy`
- **Flyway**: Java-based migration tool
- **Liquibase**: Database-independent migration tool
- **golang-migrate**: Lightweight migration tool

### 4. Migration Image Strategy

Options:

1. **Use application image** (current approach): Simple but includes unnecessary application code
2. **Dedicated migration image**: Smaller, faster, more secure
3. **Multi-stage build**: Build migration-only image from Dockerfile

Example of dedicated migration Dockerfile:

```dockerfile
FROM node:22-alpine AS migration
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN npm install -g pnpm && pnpm install --frozen-lockfile
CMD ["pnpm", "db:push"]
```

### 5. Rollback Strategy

- Keep migration history
- Test rollback procedures
- Use versioned migrations
- Consider blue-green deployments for schema changes

### 6. Monitoring and Alerts

- Add health checks for migration jobs
- Set up alerts for failed migrations
- Log migration output to centralized logging

## Manual Migration Execution

If you need to run migrations manually:

```bash
# Create a one-time pod
kubectl run db-migrate --rm -i --tty \
  --image=your-app-image:latest \
  --env="DATABASE_URL=postgresql://..." \
  --restart=Never -- pnpm db:push

# Or use existing pod
kubectl exec -it <pod-name> -- pnpm db:push
```

## Security Considerations

1. **Least Privilege**: Migration should use different DB credentials with schema modification permissions
2. **Network Policies**: Restrict database access to specific namespaces/pods
3. **Audit Logging**: Enable database audit logs for schema changes
4. **Backup Before Migration**: Always backup database before production migrations

## Recommended Production Setup

1. Use Helm Hook Jobs for migrations
2. Store credentials in Kubernetes Secrets or external secret managers
3. Use dedicated migration credentials with appropriate permissions
4. Implement proper monitoring and alerting
5. Test migrations in staging environment first
6. Have a rollback plan ready
