# Contributing to synnex-xml-sdk

Thanks for your interest in contributing! This guide covers how to set up the project, make changes, and open a pull request.

## Code of conduct

This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Ways to contribute

- Report bugs or request features via [GitHub Issues](https://github.com/bipin0x01/synnex-xml-sdk/issues)
- Improve documentation
- Fix bugs or add features via pull requests
- Review open pull requests

Before starting larger work, open an issue to discuss the approach.

## Getting started

### Prerequisites

- Node.js 14 or later
- npm (or pnpm / yarn)
- TD SYNNEX sandbox credentials (needed only for live integration tests)

### Setup

```bash
git clone https://github.com/bipin0x01/synnex-xml-sdk.git
cd synnex-xml-sdk
npm install
cp .env.example .env
```

Fill in `.env` with sandbox credentials if you plan to run integration tests. Never commit `.env` or real credentials.

### Useful scripts

| Command             | Purpose                               |
| ------------------- | ------------------------------------- |
| `npm run build`     | Compile TypeScript to `dist/`         |
| `npm test`          | Run Jest integration tests            |
| `npm run lint`      | Lint source files                     |
| `npm run format`    | Format source files with Prettier     |

## Project layout

```
src/
  client.ts          # SynnexClient public API
  types/             # Shared TypeScript types and enums
  utils/
    parser.ts        # XML → JSON parsing
    xmlBuilder.ts    # Request XML builders
tests/               # Jest integration tests
```

## Development guidelines

1. **Match existing style** — keep naming, typing, and file structure consistent with nearby code.
2. **Prefer TypeScript types** — export new request/response shapes from `src/types` when you add API surface.
3. **Document public methods** — use JSDoc on new `SynnexClient` methods.
4. **Do not commit secrets** — `.env`, credentials, and live response dumps with account data stay local.
5. **Keep PRs focused** — one concern per pull request makes review easier.

### XML / response shaping

The TD SYNNEX API often returns a single object when there is one item and an array when there are many. When adding or changing response handling, normalize those shapes so callers always get arrays where the types promise arrays. See existing handling in `src/client.ts` for patterns.

## Testing

Tests under `tests/` hit the live sandbox API and need valid credentials plus network access.

```bash
npm test
```

Tips:

- Prefer adding or uncommenting focused cases for the API you change.
- Avoid logging full payloads that contain credentials or customer data.
- If you cannot run live tests, say so in the PR and explain how you validated the change (types, build, manual XML inspection, etc.).

## Pull request process

1. Fork the repo and create a branch from `main` (for example `fix/order-status-array` or `docs/readme-freight`).
2. Make your changes and ensure `npm run build` succeeds.
3. Run `npm test` when credentials are available.
4. Update the README (or other docs) if you change public behavior.
5. Open a PR using the template. Link related issues.
6. Respond to review feedback promptly.

Maintainers may request changes, squash commits, or ask for additional tests before merging.

## Reporting security issues

Please do **not** open a public issue for security vulnerabilities. See [SECURITY.md](./SECURITY.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
