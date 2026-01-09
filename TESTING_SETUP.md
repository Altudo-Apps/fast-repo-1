# Testing Infrastructure Setup

This document outlines the complete testing infrastructure that has been set up to ensure code quality and prevent merging of broken code.

## What's Been Set Up

### 1. GitHub Actions Workflows

#### Main CI Pipeline (`.github/workflows/ci.yml`)
- Runs on pull requests and pushes to `main`/`develop`
- Performs type checking, linting, testing, and building
- Uploads test coverage reports

#### Pull Request Checks (`.github/workflows/pr-checks.yml`)
- Security audits
- Dependency checks
- Code quality checks
- Bundle size analysis

### 2. Branch Protection Configuration

The following branch protection rules should be configured in GitHub:

1. **Require pull request reviews before merging**
2. **Require status checks to pass before merging** (not completed yet)
   - CI (test-and-build)
   - Test Suite
3. **Require branches to be up to date before merging**
4. **Require conversation resolution before merging**
5. **Require signed commits** (optional but recommended)
6. **Require linear history** (not completed yet)
7. **Include administrators** (not available to us)

### 3. Code Review Automation

- **CODEOWNERS file**: Automatically requests reviews from specified team members
- **Pull Request Template**: Ensures proper documentation and testing checklist

## How to Configure Branch Protection

1. Go to your GitHub repository
2. Click **Settings** → **Branches**
3. Click **Add rule** or edit existing rules for `main` and `develop`
4. Configure the following settings:

### Required Settings
- ✅ **Require a pull request before merging**
- ✅ **Require status checks to pass before merging**
  - Add: `CI` and `Test Suite`
- ✅ **Require branches to be up to date before merging**
- ✅ **Require conversation resolution before merging**

### Optional but Recommended
- ✅ **Require signed commits**
- ✅ **Require linear history**
- ✅ **Include administrators**

### Additional Settings
- ✅ **Restrict pushes that create files larger than 100 MB**
- ✅ **Require review from code owners**
- ✅ **Dismiss stale PR approvals when new commits are pushed**
- ✅ **Require review from at least 1 reviewer**

## Testing Commands

### Local Development
```bash
# Run all tests
npm test

# Run tests in watch mode with UI
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build the application
npm run build
```

### Pre-commit Hooks
The project uses Husky for pre-commit hooks. These will automatically run:
- Linting
- Type checking
- Tests

## Test Coverage Goals

- **Minimum coverage**: 80%
- **Target coverage**: 90%
- **Critical paths**: 100%

## Monitoring and Alerts

### GitHub Actions
- All workflows run automatically on PRs and pushes
- Failed checks will block merging
- Coverage reports are uploaded to Codecov

### Manual Monitoring
- Review PR template checklist
- Check test coverage reports
- Monitor security audit results

## Troubleshooting

### Common Issues

1. **Tests failing locally but passing in CI**
   - Check Node.js version (use 20.x)
   - Clear node_modules and reinstall
   - Check for environment-specific code

2. **Branch protection blocking merges**
   - Ensure all required status checks pass
   - Update branch with latest main/develop
   - Resolve all conversations

3. **Coverage decreasing**
   - Add tests for new code
   - Review existing test coverage
   - Consider if uncovered code is necessary

### Getting Help

1. Check the [Testing Guide](headapps/nextjs-starter/TESTING.md) for detailed testing information
2. Review existing test files for patterns
3. Use the Vitest UI for interactive debugging

## Best Practices

1. **Write tests first** (TDD approach)
2. **Test behavior, not implementation**
3. **Keep tests simple and focused**
4. **Use descriptive test names**
5. **Mock external dependencies**
6. **Test accessibility**
7. **Maintain high test coverage**

## Next Steps

1. Configure branch protection rules in GitHub
2. Update CODEOWNERS with actual team members
3. Set up Codecov integration (optional)
4. Add more comprehensive tests for existing components
5. Consider adding E2E tests with Playwright or Cypress 