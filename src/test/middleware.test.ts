import type { HttpResponse } from 'zapier-platform-core';
import { describe, expect, it } from 'vitest';

import { handleBadResponses, includeApiKey } from '../middleware.js';
import { makeBundle, makeZ, TestThrottledError, TestZapierError } from './helpers.js';

describe('authentication middleware', () => {
  it('adds the bearer token without putting it in the query string', () => {
    const request = includeApiKey(
      { url: 'https://api.screpy.com/v1/account' },
      makeZ(),
      makeBundle(),
    );

    expect(request.headers?.Authorization).toBe('Bearer test_api_key');
    expect(request.headers?.Accept).toBe('application/json');
    expect(request.params).toBeUndefined();
  });
});

describe('response middleware', () => {
  const response = (status: number, retryAfter?: string) =>
    ({
      status,
      getHeader: (name: string) => (name === 'retry-after' ? retryAfter : undefined),
    }) as unknown as HttpResponse;

  it.each([
    [401, 'AuthenticationError'],
    [403, 'PermissionError'],
    [404, 'NotFoundError'],
    [409, 'ConflictError'],
    [422, 'ValidationError'],
    [503, 'ServiceUnavailableError'],
  ])('maps status %s to a safe Zapier error', (status, code) => {
    expect(() => handleBadResponses(response(status), makeZ(), makeBundle())).toThrow(
      TestZapierError,
    );

    try {
      handleBadResponses(response(status), makeZ(), makeBundle());
    } catch (error) {
      expect((error as TestZapierError).code).toBe(code);
    }
  });

  it('uses Retry-After for throttled responses', () => {
    try {
      handleBadResponses(response(429, '45'), makeZ(), makeBundle());
    } catch (error) {
      expect(error).toBeInstanceOf(TestThrottledError);
      expect((error as TestThrottledError).delay).toBe(45);
      return;
    }

    throw new Error('Expected a throttling error.');
  });

  it('returns successful responses unchanged', () => {
    const successful = response(200);
    expect(handleBadResponses(successful, makeZ(), makeBundle())).toBe(successful);
  });
});
