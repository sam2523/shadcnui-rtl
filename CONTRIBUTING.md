# Contributing to shadcnui-rtl

First off, thank you for considering contributing to shadcnui-rtl! It's people like you that make shadcnui-rtl such a great tool for the RTL community.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [Saleh7@protonmail.ch](mailto:Saleh7@protonmail.ch).

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what behavior you expected
- **Include screenshots** if relevant
- **Include your environment details** (OS, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description** of the suggested enhancement
- **Provide specific examples** to demonstrate the steps
- **Describe the current behavior** and explain which behavior you expected instead
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repo and create your branch from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Make your changes and add tests if applicable

4. Ensure the test suite passes:
   ```bash
   npm test
   ```

5. Run the tool on the examples to verify your changes:
   ```bash
   node index.js --path examples/before --dry-run
   ```

6. Update documentation if needed

7. Commit your changes using a descriptive commit message:
   ```bash
   git commit -m "Add feature: support for X transformation"
   ```

8. Push to your fork and submit a pull request

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Saleh7/shadcnui-rtl.git
   cd shadcnui-rtl
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Test the CLI locally:
   ```bash
   node index.js --help
   ```

## Project Structure

```
shadcnui-rtl/
├── index.js           # Main CLI tool
├── tests/             # Test files
│   ├── transform.test.js
│   └── cli.test.js
├── examples/          # Example transformations
│   ├── before/        # Original components
│   └── after/         # Transformed components
```

## Adding New Transformations

To add support for new Tailwind classes:

1. Add the mapping to `TAILWIND_LTR_TO_RTL_MAPPINGS` in `index.js`
2. Add tests for the transformation in `tests/transform.test.js`
3. Update the documentation in README.md
4. Add an example if applicable

Example:
```javascript
// In index.js
const TAILWIND_LTR_TO_RTL_MAPPINGS = {
  // ... existing mappings
  "your-ltr-class": "your-rtl-class",
};
```

## Testing Guidelines

- Write tests for all new functionality
- Ensure test coverage remains above 80%
- Test edge cases and error conditions
- Run tests before submitting PR:
  ```bash
  npm test
  npm run test:coverage
  ```

## Commit Message Guidelines

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
- `feat: add support for divide-x transformation`
- `fix: handle nested className expressions`
- `docs: update README with new examples`

## Review Process

1. A maintainer will review your PR
2. They may request changes or ask questions
3. Once approved, your PR will be merged
4. Your contribution will be included in the next release

## Questions?

Feel free to open an issue with the label "question" or contact the maintainer at [Saleh7@protonmail.ch](mailto:Saleh7@protonmail.ch).

Thank you for contributing! 🙏