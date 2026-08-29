# Zapier Public Review Checklist

This checklist separates code readiness from the account and usage requirements that can only be completed after private deployment.

## Ownership and account

- [ ] The integration name is exactly `Screpy`.
- [ ] At least one integration admin uses an `@screpy.com` email address.
- [ ] The Screpy homepage is configured in the Zapier Platform UI.
- [ ] Screpy owns and operates the connected production API.
- [ ] Current API documentation is publicly accessible.

## Authentication and test account

- [ ] Create a non-expiring account for `integration-testing@zapier.com`.
- [ ] Enable every paid feature required to exercise all visible components.
- [ ] Provide resettable credentials through Zapier's secure review process.
- [ ] Create a dedicated read-and-write API key for the review account.
- [ ] Confirm that revoking the key immediately blocks future requests.
- [ ] Never place test credentials in this repository or a public issue.

## Integration quality

- [ ] `npm run format:check` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] `npm run validate` passes with no errors.
- [ ] `npm run zapier:build` completes.
- [ ] Authentication sends the API key only in the bearer header.
- [ ] Every polling result has a stable, unique `id`.
- [ ] Polling results are returned newest first.
- [ ] Static samples are subsets of current live responses.
- [ ] Output fields match live Zap History data.
- [ ] Errors do not expose credentials, internal services, or raw exceptions.
- [ ] Write actions require a read-and-write key and do not add uncertain retries.

## Branding and listing

- [ ] Upload `assets/screpy.png` as the integration logo.
- [ ] Confirm the logo remains readable at small sizes.
- [ ] Add the listing description from `docs/zapier-listing.md`.
- [ ] Set homepage, documentation, support, privacy, and terms URLs.
- [ ] Confirm all user-facing text is English.
- [ ] Confirm no conflicting public Screpy integration exists in the App Directory.

## Usage evidence

- [ ] At least three distinct users have a live Zap using this integration.
- [ ] Every visible trigger, search, and action has a successful recent live Zap run.
- [ ] Admin-owned test Zaps produce the same keys as their static samples.
- [ ] Complete every row in `docs/live-zap-matrix.md`.

## Submission

- [ ] Review the current [publishing requirements](https://docs.zapier.com/integrations/publish/integration-publishing-requirements).
- [ ] Review the current [integration checks](https://docs.zapier.com/integrations/publish/integration-checks-reference).
- [ ] Resolve every blocking automated check.
- [ ] Submit the tested private version for review.
- [ ] Keep the website and dashboard marked `Soon` until users can access the integration.
