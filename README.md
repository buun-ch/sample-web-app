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

## Deployment

Build for production with `pnpm build` and start with `pnpm start`.

## License

MIT
