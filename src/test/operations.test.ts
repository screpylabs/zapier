import type {
  Bundle,
  Create,
  HttpRequestOptionsWithUrl,
  Search,
  Trigger,
  ZObject,
} from 'zapier-platform-core';
import { describe, expect, it, vi } from 'vitest';

import { creates, searches, triggers } from '../index.js';
import { makeBundle, makeZ } from './helpers.js';

type Component = Create | Search | Trigger;

const inputData = {
  project_uid: 'project-uid',
  crawl_uid: 'crawl-uid',
  url: 'https://example.com/',
  destination_url: 'https://example.com/about',
  image_url: 'https://example.com/logo.png',
  type: 'strikingDistancePages',
  range: '28d',
  limit: 50,
  return_all: false,
  name: 'Example Website',
  domain: 'example.com',
  confirm_delete: true,
  project_uid_1: 'project-one',
  project_uid_2: 'project-two',
  crawl_uid_1: 'crawl-one',
  crawl_uid_2: 'crawl-two',
  first_project_uid: 'project-one',
  first_crawl_uid: 'crawl-one',
  second_project_uid: 'project-two',
  second_crawl_uid: 'crawl-two',
  filters: [{ field: 'status_code', operator: 'gte', value: '400' }],
};

const listEndpoint = (url: string, method: string): boolean =>
  method === 'GET' &&
  (/\/projects$/.test(url) ||
    /\/crawls$/.test(url) ||
    /\/quick-wins$/.test(url) ||
    /\/pages$/.test(url) ||
    /\/links$/.test(url) ||
    /\/links\/sources$/.test(url) ||
    /\/images$/.test(url) ||
    /\/images\/sources$/.test(url));

const apiZ = (): ZObject =>
  makeZ(async (options: HttpRequestOptionsWithUrl) => {
    const method = options.method ?? 'GET';

    if (listEndpoint(options.url, method)) {
      return {
        status: 200,
        data: {
          data: /\/crawls$/.test(options.url)
            ? [
                { uid: 'crawl-success', status: 'success' },
                { uid: 'crawl-running', status: 'running' },
              ]
            : [{ uid: 'list-item', url: 'https://example.com/' }],
          meta: { next_cursor: null, warnings: [], range: '28d' },
        },
      };
    }

    if (/\/pages\/detail$/.test(options.url)) {
      return { status: 200, data: { data: { url: 'https://example.com/', status_code: 200 } } };
    }

    if (/\/crawls\/crawl-uid$/.test(options.url)) {
      return { status: 200, data: { data: { crawl_uid: 'crawl-uid', status: 'success' } } };
    }

    if (/\/projects\/project-uid$/.test(options.url) && method === 'GET') {
      return { status: 200, data: { data: { uid: 'project-uid', name: 'Website' } } };
    }

    if (method === 'DELETE') {
      return { status: 204, data: {} };
    }

    return { status: 200, data: { data: { success: true, uid: 'result-uid' } } };
  });

const perform = async (component: Component, z: ZObject, bundle: Bundle): Promise<unknown> => {
  if (typeof component.operation.perform !== 'function') {
    throw new Error(`${component.key} does not expose a perform function.`);
  }

  return component.operation.perform(z, bundle);
};

const requestContracts: Record<string, [string, string]> = {
  get_account: ['GET', '/account'],
  get_account_usage: ['GET', '/account/usage'],
  compare_crawls: ['POST', '/comparisons/crawls'],
  compare_projects: ['POST', '/comparisons/projects'],
  list_crawls: ['GET', '/projects/project-uid/crawls'],
  get_crawl_summary: ['GET', '/projects/project-uid/crawls/crawl-uid/summary'],
  start_crawl: ['POST', '/projects/project-uid/crawls'],
  list_image_sources: ['GET', '/images/sources'],
  list_images: ['GET', '/images'],
  list_link_sources: ['GET', '/links/sources'],
  list_links: ['GET', '/links'],
  get_on_page_overview: ['GET', '/on-page-overview'],
  list_pages: ['GET', '/pages'],
  list_quick_wins: ['GET', '/quick-wins'],
  get_core_web_vitals: ['GET', '/core-web-vitals'],
  get_uptime: ['GET', '/uptime'],
  create_project: ['POST', '/projects'],
  list_projects: ['GET', '/projects'],
  update_project: ['PATCH', '/projects/project-uid'],
  delete_project: ['DELETE', '/projects/project-uid'],
  find_project: ['GET', '/projects/project-uid'],
  find_crawl: ['GET', '/projects/project-uid/crawls/crawl-uid'],
  find_page: ['GET', '/pages/detail'],
};

describe('REST operation coverage', () => {
  it('executes all 23 request contracts', async () => {
    const components = { ...creates, ...searches };

    expect(Object.keys(requestContracts)).toHaveLength(23);

    for (const [key, component] of Object.entries(components)) {
      const z = apiZ();
      await expect(perform(component, z, makeBundle(inputData))).resolves.toBeDefined();

      const [expectedMethod, expectedPath] = requestContracts[key];
      const requestMock = vi.mocked(z.request);
      const request = requestMock.mock.calls.at(-1)?.[0] as HttpRequestOptionsWithUrl;

      expect(request.method).toBe(expectedMethod);
      expect(request.url).toContain(expectedPath);
    }
  });

  it('maps write action bodies without leaking unrelated inputs', async () => {
    const createZ = apiZ();
    await perform(creates.create_project, createZ, makeBundle(inputData));
    const createRequest = vi.mocked(createZ.request).mock
      .calls[0]?.[0] as HttpRequestOptionsWithUrl;
    expect(createRequest.body).toMatchObject({ name: 'Example Website', domain: 'example.com' });
    expect(createRequest.body).not.toHaveProperty('project_uid');

    const comparisonZ = apiZ();
    await perform(creates.compare_projects, comparisonZ, makeBundle(inputData));
    const comparisonRequest = vi.mocked(comparisonZ.request).mock
      .calls[0]?.[0] as HttpRequestOptionsWithUrl;
    expect(comparisonRequest.body).toMatchObject({
      project_uids: ['project-one', 'project-two'],
      crawl_selections: [
        { project_uid: 'project-one', crawl_uid: 'crawl-one' },
        { project_uid: 'project-two', crawl_uid: 'crawl-two' },
      ],
    });
  });

  it('serializes filters on crawl-data list actions', async () => {
    const z = apiZ();
    await perform(creates.list_pages, z, makeBundle(inputData));
    const request = vi.mocked(z.request).mock.calls[0]?.[0] as HttpRequestOptionsWithUrl;
    expect(request.params).toMatchObject({
      'filters[0][field]': 'status_code',
      'filters[0][operator]': 'gte',
      'filters[0][value]': '400',
    });
  });
});

describe('polling triggers', () => {
  it('uses crawl UID as the New Crawl deduplication ID', async () => {
    const result = (await perform(
      triggers.new_crawl,
      apiZ(),
      makeBundle({ project_uid: 'project-uid' }),
    )) as Array<Record<string, unknown>>;

    expect(result.map(({ id }) => id)).toEqual(['crawl-success', 'crawl-running']);
  });

  it('only emits successful crawls from Crawl Completed', async () => {
    const result = (await perform(
      triggers.crawl_completed,
      apiZ(),
      makeBundle({ project_uid: 'project-uid' }),
    )) as Array<Record<string, unknown>>;

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: 'crawl-success', status: 'success' });
  });
});
