import type { Bundle, HttpRequestOptionsWithUrl, ZObject } from 'zapier-platform-core';
import { vi } from 'vitest';

export class TestZapierError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export class TestThrottledError extends Error {
  delay?: number;

  constructor(message: string, delay?: number) {
    super(message);
    this.delay = delay;
  }
}

export const makeBundle = (inputData: Record<string, unknown> = {}): Bundle =>
  ({
    authData: { api_key: 'test_api_key' },
    inputData,
    inputDataRaw: {},
    meta: {
      isBulkRead: false,
      isFillingDynamicDropdown: false,
      isLoadingSample: false,
      isPopulatingDedupe: false,
      isTestingAuth: false,
      limit: 100,
      page: 0,
      timezone: 'UTC',
      inputFields: {},
    },
  }) as Bundle;

export const makeZ = (
  handler: (options: HttpRequestOptionsWithUrl) => Promise<unknown> = async () => ({
    status: 200,
    data: { data: {} },
  }),
): ZObject =>
  ({
    request: vi.fn(handler),
    errors: {
      Error: TestZapierError,
      ThrottledError: TestThrottledError,
    },
  }) as unknown as ZObject;
