import type { Bundle, InputField, PlainOutputField, ZObject } from 'zapier-platform-core';

import { request } from './api.js';
import { FILTER_OPERATORS } from './constants.js';
import type { ApiEnvelope, CrawlRecord, JsonObject } from './types.js';

const choices = (items: readonly (readonly [string, string])[]) =>
  Object.fromEntries(items.map(([label, value]) => [value, label]));

export const getProjectChoices = async (z: ZObject, bundle: Bundle) => {
  const response = await request<ApiEnvelope<JsonObject[]>>(z, bundle, {
    path: '/projects',
    params: {
      limit: 100,
      cursor: bundle.meta.paging_token,
    },
  });

  return {
    results: response.data.map((project) => ({
      id: String(project.uid),
      label: `${String(project.name)} (${String(project.domain)})`,
    })),
    paging_token: response.meta?.next_cursor ?? null,
  };
};

export const getCrawlChoices = async (z: ZObject, bundle: Bundle) => {
  return getCrawlChoicesFor('project_uid')(z, bundle);
};

const getCrawlChoicesFor = (projectKey: string) => async (z: ZObject, bundle: Bundle) => {
  const projectUid = bundle.inputData[projectKey];

  if (!projectUid) {
    return { results: [], paging_token: null };
  }

  const response = await request<ApiEnvelope<CrawlRecord[]>>(z, bundle, {
    path: `/projects/${encodeURIComponent(String(projectUid))}/crawls`,
    params: {
      limit: 100,
      cursor: bundle.meta.paging_token,
    },
  });

  return {
    results: response.data.map((crawl) => ({
      id: crawl.uid,
      label: `${crawl.uid}${crawl.status ? ` — ${crawl.status}` : ''}`,
    })),
    paging_token: response.meta?.next_cursor ?? null,
  };
};

export const projectField = (
  key = 'project_uid',
  label = 'Project',
  required = true,
): InputField => ({
  key,
  label,
  type: 'string',
  required,
  choices: { perform: getProjectChoices },
  helpText: 'Select a Screpy project or map its 16-character project UID.',
});

export const crawlField = (
  key = 'crawl_uid',
  label = 'Crawl',
  required = true,
  projectKey = 'project_uid',
): InputField => ({
  key,
  label,
  type: 'string',
  required,
  choices: { perform: getCrawlChoicesFor(projectKey) },
  helpText: 'Select a crawl from the chosen project or map its 16-character crawl UID.',
});

export const paginationFields = (): InputField[] => [
  {
    key: 'return_all',
    label: 'Return All',
    type: 'boolean',
    default: 'false',
    helpText: 'Fetch every page of results. Leave disabled to return one API page.',
  },
  {
    key: 'limit',
    label: 'Limit',
    type: 'integer',
    default: '50',
    helpText: 'Number of results to return when Return All is disabled. Minimum 1, maximum 100.',
  },
  {
    key: 'starting_cursor',
    label: 'Starting Cursor',
    type: 'string',
    required: false,
    helpText: 'Optional opaque cursor returned by an earlier Screpy request.',
  },
];

export const filterField = (fields: readonly (readonly [string, string])[]): InputField => ({
  key: 'filters',
  label: 'Filters',
  children: [
    {
      key: 'field',
      label: 'Field',
      type: 'string',
      required: true,
      choices: choices(fields),
    },
    {
      key: 'operator',
      label: 'Operator',
      type: 'string',
      required: true,
      default: 'eq',
      choices: Object.fromEntries(FILTER_OPERATORS.map(({ label, value }) => [value, label])),
    },
    {
      key: 'value',
      label: 'Value',
      type: 'string',
      required: false,
      helpText: 'Leave empty only when Is Null should check for null.',
    },
  ],
});

export const outputFields = {
  project: [
    { key: 'uid', label: 'Project UID', type: 'string' },
    { key: 'name', label: 'Project Name', type: 'string' },
    { key: 'domain', label: 'Domain', type: 'string' },
    { key: 'role', label: 'Role', type: 'string' },
  ],
  crawl: [
    { key: 'uid', label: 'Crawl UID', type: 'string' },
    { key: 'project_uid', label: 'Project UID', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'started_at', label: 'Started At', type: 'datetime' },
    { key: 'finished_at', label: 'Finished At', type: 'datetime' },
  ],
  list: [{ key: 'next_cursor', label: 'Next Cursor', type: 'string' }],
} satisfies Record<string, PlainOutputField[]>;
