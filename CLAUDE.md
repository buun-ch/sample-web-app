# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands

```bash
# Install dependencies (project uses pnpm)
pnpm install

# Run development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint
```

### Testing

No test framework is currently configured. When implementing tests, first check with the user about their preferred testing framework (Jest, Vitest, etc.).

## Architecture Overview

This is a Next.js 15.4.7 application using the App Router architecture with TypeScript and Tailwind CSS v4.

### Key Architectural Decisions

1. **App Router Structure**: All pages and layouts are in the `/app` directory following Next.js 13+ conventions
2. **Styling**: Tailwind CSS v4 with PostCSS, configured with custom color theming and dark mode support
3. **TypeScript**: Strict mode enabled with path aliases (`@/*` maps to project root)
4. **Runtime**: Node.js 22.18.0 managed via mise

### Project Structure

```plain
app/
├── layout.tsx    # Root layout with Geist fonts and metadata
├── page.tsx      # Home page component
└── globals.css   # Global styles with Tailwind directives and theming
```

### Important Configuration Files

- `tsconfig.json`: TypeScript with Next.js plugin, strict mode, and path aliases
- `tailwind.config.ts`: Tailwind v4 configuration
- `next.config.ts`: Next.js configuration (currently using defaults)
- `mise.toml`: Node.js version pinned to 22.18.0

### Development Notes

- The project uses Turbopack for faster development builds (`--turbo` flag in dev script)
- Both npm and pnpm lock files exist; pnpm is preferred
- ESLint is configured with Next.js core web vitals and TypeScript rules using flat config forma

## Code Style

- Follow eslint and prettier rules as defined in the project
- Follow TypeScript best practices
- Follow existing code style and conventions in the project
- Only write code comments when necessary, as the code should be self-explanatory
- Write output messages and code comments in English
- Markdown files should be formatted using `markdownlint` rules
