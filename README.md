# Screpy for Zapier

Official Screpy integration for Zapier, built with the Zapier Platform CLI and TypeScript.

This repository implements the complete Screpy REST API surface supported by the official n8n community node, plus two polling triggers designed for Zapier. It is prepared for private deployment and Zapier's public integration review, but it is not yet published in the Zapier App Directory.

## Features

### Triggers

- New Crawl
- Crawl Completed

### Searches

- Find Project
- Find Crawl
- Find Page

### Actions

- Get Account
- Get Account Usage
- Compare Crawls
- Compare Projects
- List Crawls
- Get Crawl Summary
- Start Crawl
- List Image Sources
- List Images
- List Link Sources
- List Links
- Get On-Page Overview
- List Pages
- Get Quick Wins
- Get Core Web Vitals
- Get Uptime
- Create Project
- List Projects
- Update Project
- Delete Project

## Authentication

The integration uses a Screpy REST API key as a bearer token.

1. Sign in to Screpy.
2. Open **Settings > Connected Apps**.
3. Create a REST API key.
4. Choose **Read-only** for read operations or **Read and write** for all operations.
5. Copy the key when Screpy displays it.
6. Add the key to the Screpy connection in Zapier.

Screpy API keys and Screpy MCP OAuth credentials are different. Never paste an MCP token into the Zapier connection.

## Pagination and filters

List actions support:

- `Return All` to follow cursor pagination until the API is exhausted.
- `Limit` from 1 to 100 for a single API page.
- `Starting Cursor` for resuming from an opaque Screpy cursor.

Page, link, and image actions support up to 20 structured filters. The `In` operator accepts either comma-separated values or a JSON array and allows up to 100 values.

## Local development

Requirements:

- Node.js 22.22 or later in the Node.js 22 release line.
- npm.

Install and verify:

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm test
npm run validate
npm run zapier:build
```

Tests use mocked HTTP responses and never require a Screpy API key.

## Project structure

```text
src/
  api.ts                 Shared Screpy HTTP, pagination, and filter behavior
  authentication.ts      Zapier custom API-key authentication
  fields.ts              Reusable fields and dynamic choices
  middleware.ts          Authorization and safe error mapping
  operations/            Account, project, crawl, crawl-data, comparison, and health actions
  triggers/              Polling triggers
  test/                  Mocked integration tests
docs/                    Zapier review and release material
```

## Publishing

Zapier deployment is intentionally manual. Follow [the release process](docs/release-process.md) after a Screpy owner has approved the version and provided Zapier credentials. Do not commit `.zapierapprc`, deploy keys, API keys, or test-account credentials.

## Documentation

- [Screpy REST API](https://screpy.com/docs/api)
- [API authentication](https://screpy.com/docs/api/authentication)
- [API errors and limits](https://screpy.com/docs/api/errors-and-limits)
- [Zapier Platform CLI](https://docs.zapier.com/integrations/build-cli/overview)

## Security

See [SECURITY.md](SECURITY.md) for supported versions and private disclosure instructions.

## License

[MIT](LICENSE.md)
