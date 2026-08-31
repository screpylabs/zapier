# Release Process

Zapier deployment is manual and requires a Screpy-owned Zapier developer account.

## 1. Prepare the version

1. Confirm the working tree contains only intended integration changes.
2. Update the package version and `CHANGELOG.md`.
3. Run all local checks documented in `README.md`.
4. Confirm no key, deploy token, password, or `.zapierapprc` file is tracked.

## 2. Link or register the integration

Authenticate with a Screpy-owned Zapier account:

```bash
npx --yes --package zapier-platform-cli@19.1.0 zapier-platform login
```

For the first private version, register the integration. For an existing integration, link the local repository to its Zapier app ID. Keep the generated `.zapierapprc` file local and untracked.

## 3. Deploy privately

```bash
npm run validate
npm run zapier:build
npx --yes --package zapier-platform-cli@19.1.0 zapier-platform push --skip-dep-install
```

Do not promote the version at this stage.

## 4. Validate live behavior

1. Invite the required test users.
2. Connect the dedicated Screpy review account.
3. Complete `docs/live-zap-matrix.md`.
4. Inspect Zap History for every component.
5. Confirm static samples and output fields match live results.
6. Resolve all Zapier integration checks.

## 5. Submit for public review

1. Complete `docs/review-checklist.md`.
2. Configure the branding and URLs from `docs/zapier-listing.md`.
3. Submit the tested version through the Zapier Platform UI.
4. Respond to reviewer feedback with a new version when code changes are required.

## 6. Release communication

Only after the integration is accessible to intended users:

- Replace `Soon` links on the Screpy website and member dashboard.
- Add the final Zapier installation URL to Screpy documentation.
- Announce the integration through the appropriate Screpy release surface.
