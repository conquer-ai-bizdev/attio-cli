# Contributing to Attio CLI

Thank you for your interest in contributing to Attio CLI!

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Attio API key (get from https://app.attio.com/settings/api)

### Initial Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/attio-cli.git
cd attio-cli
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
# Edit .env and add your ATTIO_API_KEY
```

4. Build the project:
```bash
npm run build
```

5. Run tests:
```bash
npm test
npm run test:integration
```

## Development Workflow

### Project Structure

```
attio-cli/
├── src/
│   ├── api/              # API client and endpoints
│   │   ├── client.ts     # HTTP client
│   │   ├── errors.ts     # Error types
│   │   ├── types.ts      # Zod schemas
│   │   └── endpoints/    # API endpoint modules
│   ├── commands/         # CLI commands
│   ├── formatters/       # Output formatters (json, table, csv)
│   ├── utils/            # Utilities
│   └── cli.ts            # Main CLI entry
├── tests/
│   ├── unit/             # Unit tests (mocked)
│   └── integration/      # Integration tests (real API)
└── docs/                 # API documentation
```

### Running in Development

Use `npm run dev` to run the CLI without building:

```bash
npm run dev workspace members list
npm run dev object list --format table
```

### Testing

#### Unit Tests

Unit tests use mocked API responses and test logic in isolation:

```bash
npm test
npm run test:watch  # Watch mode
```

#### Integration Tests

Integration tests hit the real Attio API. You **must** have `ATTIO_API_KEY` set:

```bash
npm run test:integration
```

**Important**: Integration tests may create/modify data in your workspace. Use a test workspace when possible.

### Adding a New Command

1. Create API endpoint in `src/api/endpoints/<resource>.ts`
2. Add Zod schemas to `src/api/types.ts`
3. Create command in `src/commands/<resource>.ts`
4. Register command in `src/cli.ts`
5. Write unit tests in `tests/unit/`
6. Write integration tests in `tests/integration/`

Example:

```typescript
// src/api/endpoints/example.ts
export class ExampleEndpoints {
  constructor(private client: AttioClient) {}

  async list(): Promise<Example[]> {
    const response = await this.client.get('/examples');
    return validate(ExamplesResponseSchema, response).data;
  }
}

// src/commands/example.ts
export function createExampleCommand(): Command {
  const cmd = new Command('example');
  cmd.command('list')
    .option('--format <format>', 'Output format', 'json')
    .action(async (options) => {
      const client = new AttioClient();
      const api = new ExampleEndpoints(client);
      const data = await api.list();
      console.log(formatJson(data));
    });
  return cmd;
}
```

### Code Style

We use ESLint and Prettier for code formatting:

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
npm run format      # Format code
```

**Important conventions**:

- Use TypeScript strict mode (no `any`, no implicit types)
- All API responses must be validated with Zod schemas
- Prefer immutability and functional patterns
- Handle errors gracefully with typed error classes
- Write both unit and integration tests

### Type Safety

The project enforces strict TypeScript:

```bash
npm run type-check  # Run TypeScript compiler without emitting files
```

All code must:
- Pass `tsc --noEmit` without errors
- Have no `any` types (except in specific cases)
- Use Zod for runtime validation of API responses

### Commit Guidelines

Use clear, descriptive commit messages:

```
<type>: <description>

<optional body>

Co-Authored-By: Name <email>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `chore`: Maintenance tasks

Example:
```
feat: add record management commands

Implement create, read, update, delete for records.
Supports filtering and querying.

Co-Authored-By: Your Name <your@email.com>
```

### Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes
4. Write/update tests
5. Ensure all tests pass: `npm test && npm run test:integration`
6. Ensure code quality: `npm run lint && npm run type-check`
7. Commit your changes following commit guidelines
8. Push to your fork
9. Open a Pull Request

### Running the Full CI Suite Locally

Before submitting a PR, run:

```bash
npm run lint
npm run type-check
npm test
npm run test:integration
npm run build
```

All of these must pass.

## Questions?

Feel free to open an issue for questions or discussions!

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.
