# APILine - PNPM Workspace

A collection of API packages managed using PNPM workspaces.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- PNPM >= 8.0.0

### Installation
```bash
# Install all dependencies for all packages
pnpm install
```

## 📦 Available Packages

- **@apiline/news-api** - NestJS-based news API service

## 🛠️ Available Scripts

Run these commands from the root directory to operate on all packages:

### Development
```bash
pnpm dev              # Start all packages in development mode
pnpm start:dev        # Same as above
pnpm start:prod       # Start all packages in production mode
```

### Building & Testing
```bash
pnpm build            # Build all packages
pnpm test             # Run tests for all packages
pnpm test:watch       # Run tests in watch mode for all packages
pnpm test:cov         # Run tests with coverage for all packages
pnpm test:e2e         # Run e2e tests for all packages
```

### Code Quality
```bash
pnpm lint             # Lint all packages
pnpm lint:fix         # Lint and fix all packages
pnpm format           # Format code for all packages
```

### Maintenance
```bash
pnpm clean            # Clean build artifacts for all packages
pnpm update:all       # Update dependencies for all packages
```

## 🏗️ Project Structure

```
apiline/
├── packages/
│   └── news-api/          # NestJS news API service
├── package.json           # Root workspace configuration
├── pnpm-workspace.yaml    # PNPM workspace configuration
└── README.md
```

## 🔧 Adding New Packages

1. Create a new directory in `packages/`
2. Initialize with `package.json` using `@apiline/` scope
3. The package will automatically be included in workspace operations

## 📝 Environment Setup

Each package may require its own environment configuration. Check individual package README files for specific setup instructions.
