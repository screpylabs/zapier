# Zapier Public Review Checklist

This checklist separates code readiness from the account and usage requirements that can only be completed after private deployment.

Last technical verification: 2026-08-29. Zapier validation reports 0 errors, 59 publishing tasks that require live usage or account setup, and 36 non-blocking general warnings.

## Ownership and account

- [x] The integration name is exactly `Screpy`.
- [ ] At least one integration admin uses an `@screpy.com` email address.
- [x] The Screpy homepage is configured in the Zapier Platform UI.
- [x] Screpy owns and operates the connected production API.
- [x] Current API documentation is publicly accessible.

## Authentication and test account

- [ ] Create a non-expiring account for `integration-testing@zapier.com`.
- [ ] Enable every paid feature required to exercise all visible components.
- [ ] Provide resettable credentials through Zapier's secure review process.
- [ ] Create a dedicated read-and-write API key for the review account.
- [ ] Confirm that revoking the key immediately blocks future requests.
- [x] Never place test credentials in this repository or a public issue.

## Integration quality

- [x] `npm run format:check` passes.
- [x] `npm run lint` passes.
- [x] `npm run typecheck` passes.
- [x] `npm test` passes.
- [x] `npm run validate` passes with no errors.
- [x] `npm run zapier:build` completes.
- [x] Authentication sends the API key only in the bearer header.
- [x] Every polling result has a stable, unique `id`.
- [x] Polling results are returned newest first.
- [ ] Static samples are subsets of current live responses.
- [ ] Output fields match live Zap History data.
- [x] Errors do not expose credentials, internal services, or raw exceptions.
- [x] Write actions require a read-and-write key and do not add uncertain retries.

## Branding and listing

- [x] Upload `assets/screpy.png` as the integration logo.
- [x] Confirm the logo remains readable at small sizes.
- [x] Add the listing description from `docs/zapier-listing.md`.
- [ ] Set homepage, documentation, support, privacy, and terms URLs.
- [x] Confirm all user-facing text is English.
- [x] Confirm no conflicting public Screpy integration exists in the App Directory.

## Usage evidence

- [ ] At least three distinct users have a live Zap using this integration.
- [ ] Every visible trigger, search, and action has a successful recent live Zap run.
- [ ] Admin-owned test Zaps produce the same keys as their static samples.
- [ ] Complete every row in `docs/live-zap-matrix.md`.

## Submission

- [x] Review the current [publishing requirements](https://docs.zapier.com/integrations/publish/integration-publishing-requirements).
- [x] Review the current [integration checks](https://docs.zapier.com/integrations/publish/integration-checks-reference).
- [ ] Resolve every blocking automated check.
- [ ] Submit the tested private version for review.
- [x] Keep the website and dashboard marked `Soon` until users can access the integration.
