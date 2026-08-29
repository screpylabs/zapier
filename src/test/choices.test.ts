import type { HttpRequestOptionsWithUrl } from 'zapier-platform-core';
import { describe, expect, it } from 'vitest';

import { getCrawlChoices, getProjectChoices } from '../fields.js';
import { makeBundle, makeZ } from './helpers.js';

describe('dynamic choices', () => {
  it('returns paginated project choices', async () => {
    const bundle = makeBundle();
    bundle.meta.paging_token = 'project-cursor';
    const z = makeZ(async (options: HttpRequestOptionsWithUrl) => {
      expect(options.params?.cursor).toBe('project-cursor');
      return {
        status: 200,
        data: {
          data: [{ uid: 'project-uid', name: 'Website', domain: 'example.com' }],
          meta: { next_cursor: 'next-project-cursor' },
        },
      };
    });

    await expect(getProjectChoices(z, bundle)).resolves.toEqual({
      results: [{ id: 'project-uid', label: 'Website (example.com)' }],
      paging_token: 'next-project-cursor',
    });
  });

  it('returns crawls for the selected project', async () => {
    const z = makeZ(async (options: HttpRequestOptionsWithUrl) => {
      expect(options.url).toContain('/projects/project-uid/crawls');
      return {
        status: 200,
        data: {
          data: [{ uid: 'crawl-uid', status: 'success' }],
          meta: { next_cursor: null },
        },
      };
    });

    await expect(getCrawlChoices(z, makeBundle({ project_uid: 'project-uid' }))).resolves.toEqual({
      results: [{ id: 'crawl-uid', label: 'crawl-uid — success' }],
      paging_token: null,
    });
  });

  it('does not request crawls until a project is selected', async () => {
    const z = makeZ();
    await expect(getCrawlChoices(z, makeBundle())).resolves.toEqual({
      results: [],
      paging_token: null,
    });
    expect(z.request).not.toHaveBeenCalled();
  });
});
