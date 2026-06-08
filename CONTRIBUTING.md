# Contributing to LawFirm Marketing Hub

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Git

### Local Development Setup

1. **Fork the repository**
   ```bash
   # On GitHub, click "Fork"
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/lawfirm-hub.git
   cd lawfirm-hub
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/wouapit999/lawfirm-hub.git
   ```

4. **Set up backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your local settings
   npm install
   npm run start:dev
   ```

5. **Set up frontend** (in new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Development Workflow

### Creating a Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions

### Writing Code

#### Backend (NestJS)
- Use TypeScript with strict mode
- Follow NestJS conventions
- Place code in appropriate modules
- Use dependency injection
- Add error handling
- Write meaningful commit messages

Example structure:
```typescript
// controllers/example.controller.ts
@Controller('api/example')
export class ExampleController {
  constructor(private exampleService: ExampleService) {}

  @Get()
  findAll() {
    return this.exampleService.findAll();
  }
}

// services/example.service.ts
@Injectable()
export class ExampleService {
  findAll() {
    // Implementation
  }
}

// modules/example.module.ts
@Module({
  controllers: [ExampleController],
  providers: [ExampleService],
})
export class ExampleModule {}
```

#### Frontend (Next.js)
- Use React functional components
- Prefer TypeScript over JavaScript
- Use React hooks
- Use React Query for data fetching
- Follow component naming conventions
- Keep components focused and reusable

Example component:
```typescript
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface ExampleProps {
  id: string;
}

export function ExampleComponent({ id }: ExampleProps) {
  const [count, setCount] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['example', id],
    queryFn: () => fetch(`/api/example/${id}`).then(r => r.json()),
  });

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### Code Style

- **Linting**: Run `npm run lint` before committing
- **Formatting**: Use Prettier (configured in project)
- **TypeScript**: No `any` types unless absolutely necessary
- **Comments**: Only comment non-obvious logic
- **Naming**: Use clear, descriptive names

### Testing

#### Backend Tests
```bash
cd backend
npm test                 # Run all tests
npm test:watch         # Watch mode
npm test:cov           # Coverage report
```

#### Writing Tests
```typescript
describe('ExampleService', () => {
  let service: ExampleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExampleService],
    }).compile();

    service = module.get<ExampleService>(ExampleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return example data', () => {
    const result = service.findAll();
    expect(result).toEqual([]);
  });
});
```

#### Frontend Tests
```bash
cd frontend
npm test              # Run tests
npm test:watch      # Watch mode
```

### Committing Changes

1. **Stage changes**
   ```bash
   git add .
   ```

2. **Write meaningful commit message**
   ```bash
   git commit -m "feat: add AI content generation"
   ```

**Commit message conventions:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting, semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Build, dependencies, etc.

### Pushing Changes

```bash
# Push to your fork
git push origin feature/your-feature-name
```

### Creating a Pull Request

1. **Go to GitHub**
   - Click "Compare & pull request"
   - Or go to "Pull requests" → "New pull request"

2. **Fill in PR details**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Related Issues
   Closes #123

   ## Testing
   How was this tested?

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Tests added/updated
   - [ ] Documentation updated
   ```

3. **Wait for review**
   - CI/CD pipeline must pass
   - Code review required
   - Address feedback in new commits

## Pull Request Guidelines

### Before Submitting

- [ ] Code builds without errors
- [ ] All tests pass (`npm test`)
- [ ] Code is linted (`npm run lint`)
- [ ] TypeScript compiles (`npm run build`)
- [ ] Changes are documented
- [ ] Branch is up to date with main

### What We Look For

- **Code quality**: Clean, readable, maintainable
- **Tests**: New features have tests
- **Documentation**: Changes are documented
- **Performance**: No unnecessary performance regressions
- **Security**: No security vulnerabilities
- **Consistency**: Follows project patterns

## Layers and Modules

### Layer 1: Authentication
```
backend/src/auth/
├── guards/
├── services/
├── controllers/
└── auth.module.ts
```

### Layer 5: AI Content Generation
```
backend/src/ai/
├── ai-generation.service.ts
├── ai-generation.controller.ts
└── ai.module.ts
```

When contributing to a specific layer, follow its patterns and conventions.

## Documentation

### README Updates
- Keep README.md current with major changes
- Update version numbers
- Add new features to feature list

### API Documentation
- Document new endpoints in code comments
- Update `backend/README.md` for API changes
- Include request/response examples

### Component Documentation
- Add JSDoc comments to functions
- Document props in React components
- Include usage examples for complex components

## Reporting Issues

### Bug Reports
Include:
- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- System information (OS, Node version, etc.)
- Screenshots/logs if applicable

### Feature Requests
Include:
- Clear description of the feature
- Use case and motivation
- Possible implementation approach
- Any related issues

## Performance Considerations

- Minimize database queries
- Use caching where appropriate
- Optimize frontend bundle size
- Profile code for bottlenecks
- Avoid N+1 query problems

## Security

- Never commit sensitive data (API keys, passwords)
- Use environment variables for secrets
- Validate all user input
- Follow OWASP guidelines
- Review security implications of changes
- Report security issues privately

## Accessibility

- Ensure components are keyboard accessible
- Use semantic HTML
- Add ARIA labels where needed
- Test with screen readers
- Maintain good color contrast

## Browser Compatibility

- Test on Chrome, Firefox, Safari, Edge
- Support modern browsers (last 2 versions)
- Use polyfills for older browser features
- Test mobile responsiveness

## Performance Benchmarks

- Page load time: < 3 seconds
- API response time: < 500ms
- AI generation: 5-10 seconds
- Bundle size: < 500KB (gzipped)

## Development Tools

### Useful Commands

**Backend:**
```bash
npm run start:dev      # Development server
npm run build          # Build for production
npm test              # Run tests
npm run lint          # Run linter
```

**Frontend:**
```bash
npm run dev           # Development server
npm run build         # Build for production
npm test              # Run tests
npm run lint          # Run linter
```

### Debugging

**Backend:**
```bash
# Debug with Node inspector
node --inspect-brk dist/main.js

# In Chrome: chrome://inspect
```

**Frontend:**
```bash
# Browser DevTools
F12 or Ctrl+Shift+I

# React DevTools extension
# Redux DevTools extension (if using Redux)
```

## Deployment

### Staging Deployment
```bash
git push origin feature-branch
# Automatic deployment to staging
```

### Production Deployment
```bash
# Create PR to main
# Pass all CI checks
# Get approval
# Merge to main
# Automatic deployment to production
```

## Help and Questions

- **Documentation**: Check LAYER5_INTEGRATION_GUIDE.md
- **Issues**: Search existing issues first
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Send detailed questions to maintainers

## Recognition

Contributors who have significant impact will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Recognized in project README

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to making LawFirm Marketing Hub better! 🙏
