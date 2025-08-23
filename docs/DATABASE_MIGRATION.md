# Database Migration Strategy

## Overview

This document describes the database migration strategy for the sample-web-app in Kubernetes environments.

## Migration Method

### Init Container (All Environments)

We use init containers that run before the main application container starts. This is now the recommended approach for all environments including production.

**Pros:**

- Simple to implement and maintain
- Runs automatically with each pod deployment
- Ensures database is ready before application starts
- Works well with modern deployment patterns
- Follows Drizzle ORM best practices

**Implementation:**

- Uses `drizzle-orm` migrate() function (production recommended)
- Lightweight dependency footprint
- No external tools required beyond drizzle-orm and pg

**Configuration:**

```yaml
migration:
  enabled: true
  env:
    - name: DATABASE_URL
      value: postgresql://user:pass@host:port/db
```

## Best Practices for Production

### 1. Use Drizzle ORM's migrate() Function

The init container uses `drizzle-orm`'s programmatic migrate() function instead of `drizzle-kit push`:

```javascript
const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
await migrate(db, { migrationsFolder: './drizzle' });
```

**Benefits:**
- Lightweight (no drizzle-kit dependencies)
- Production-optimized
- Proper migration history tracking

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

### 3. Migration File Generation

Generate migration files during development:

```bash
# Generate migration files
pnpm db:generate

# Commit generated files to version control
git add drizzle/
git commit -m "feat: add new database migration"
```

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

1. Use Init Container with drizzle-orm migrate() function
2. Store credentials in Kubernetes Secrets or external secret managers  
3. Use dedicated migration credentials with appropriate permissions
4. Generate migration files during development and commit to version control
5. Test migrations in staging environment first
6. Monitor init container logs for migration status
