import type { HttpRequestOptionsWithUrl } from 'zapier-platform-core';
import { describe, expect, it } from 'vitest';

import { requestList, serializeFilters } from '../api.js';
import { makeBundle, makeZ } from './helpers.js';

describe('cursor pagination', () => {
  it('returns one page and exposes the next cursor', async () => {
    const z = makeZ(async () => ({
      status: 200,
      data: { data: [{ uid: 'one' }], meta: { next_cursor: 'next-page' } },
    }));

    const result = await requestList(z, makeBundle({ limit: 25 }), { path: '/projects' });

    expect(result).toMatchObject({ items: [{ uid: 'one' }], next_cursor: 'next-page' });
    expect(z.request).toHaveBeenCalledTimes(1);
  });

  it('follows every opaque cursor when Return All is enabled', async () => {
    const z = makeZ(async (options: HttpRequestOptionsWithUrl) => {
      const cursor = options.params?.cursor;

      return cursor === 'cursor-two'
        ? { status: 200, data: { data: [{ uid: 'two' }], meta: { next_cursor: null } } }
        : {
            status: 200,
            data: { data: [{ uid: 'one' }], meta: { next_cursor: 'cursor-two' } },
          };
    });

    const result = await requestList(z, makeBundle({ return_all: true }), { path: '/projects' });

    expect(result.items).toEqual([{ uid: 'one' }, { uid: 'two' }]);
    expect(result.next_cursor).toBeNull();
    expect(z.request).toHaveBeenCalledTimes(2);
  });

  it('passes a starting cursor through unchanged', async () => {
    const z = makeZ(async (options: HttpRequestOptionsWithUrl) => {
      expect(options.params?.cursor).toBe('opaque+/cursor==');
      return { status: 200, data: { data: [], meta: { next_cursor: null } } };
    });

    await requestList(z, makeBundle({ starting_cursor: 'opaque+/cursor==' }), {
      path: '/projects',
    });
  });
});

describe('structured crawl filters', () => {
  it('serializes normal, In, and Is Null filters', () => {
    expect(
      serializeFilters([
        { field: 'status_code', operator: 'gte', value: 400 },
        { field: 'url', operator: 'in', value: 'https://a.test, https://b.test' },
        { field: 'canonical', operator: 'is_null', value: '' },
      ]),
    ).toEqual({
      'filters[0][field]': 'status_code',
      'filters[0][operator]': 'gte',
      'filters[0][value]': 400,
      'filters[1][field]': 'url',
      'filters[1][operator]': 'in',
      'filters[1][value][0]': 'https://a.test',
      'filters[1][value][1]': 'https://b.test',
      'filters[2][field]': 'canonical',
      'filters[2][operator]': 'is_null',
      'filters[2][value]': true,
    });
  });

  it('accepts JSON arrays for In', () => {
    expect(
      serializeFilters([{ field: 'status_code', operator: 'in', value: '[200,404]' }]),
    ).toMatchObject({
      'filters[0][value][0]': 200,
      'filters[0][value][1]': 404,
    });
  });

  it('enforces filter and In value limits', () => {
    expect(() =>
      serializeFilters(
        Array.from({ length: 21 }, () => ({ field: 'url', operator: 'eq', value: 'x' })),
      ),
    ).toThrow('at most 20 filters');

    expect(() =>
      serializeFilters([
        {
          field: 'url',
          operator: 'in',
          value: Array.from({ length: 101 }, (_, index) => index).join(','),
        },
      ]),
    ).toThrow('between 1 and 100 items');
  });
});
