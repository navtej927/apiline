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

## 🐳 Docker Setup

### Prerequisites
- Docker
- Docker Compose

### Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your actual values
# At minimum, add your NEWS_API_KEY
```

### Development with Docker
```bash
# Build and start all services
pnpm docker:up

# Or run in detached mode
pnpm docker:up:detached

# View logs
pnpm docker:logs

# Stop services
pnpm docker:down

# Clean up everything (containers, volumes, images)
pnpm docker:clean
```

### Production with Docker
```bash
# Build and start production services
pnpm docker:prod:build
pnpm docker:prod:up

# View production logs
pnpm docker:prod:logs

# Stop production services
pnpm docker:prod:down
```

### Available Services
- **news-api**: Main NestJS application (port 3001)
- **redis**: Redis cache (port 6380 → 6379)
- **postgres**: PostgreSQL database (port 5433 → 5432)
- **nginx**: Reverse proxy (port 80, production only)

## 📝 Environment Setup

Each package may require its own environment configuration. Check individual package README files for specific setup instructions.

### Required Environment Variables
- `NEWS_API_KEY`: Your News API key from newsapi.org
- `POSTGRES_USER`: Database username (default: apiline)
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_DB`: Database name (default: apiline)
- `REDIS_PASSWORD`: Redis password (production only)
