# Contributing

Thank you for helping improve the official Screpy integration for Zapier.

## Development workflow

1. Create a focused branch from `main`.
2. Install dependencies with `npm ci`.
3. Keep changes limited to the requested Screpy or Zapier behavior.
4. Add or update tests for behavior changed in this repository.
5. Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run validate`, and `npm run zapier:build`.
6. Open a pull request describing the user-visible effect and verification performed.

## API compatibility

- Use only documented endpoints under `https://api.screpy.com/v1`.
- Preserve opaque cursors exactly as returned.
- Do not expose API keys, raw provider errors, or internal service details.
- Do not retry uncertain write requests in custom code.
- Keep user-facing Zapier copy in English.

## Releases

Only Screpy maintainers may deploy or promote a Zapier version. Follow [the release process](docs/release-process.md).
