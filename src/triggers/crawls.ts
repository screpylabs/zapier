import type { Trigger } from 'zapier-platform-core';

import { pathSegment, request } from '../api.js';
import { CRAWL_SAMPLE } from '../constants.js';
import { outputFields, projectField } from '../fields.js';
import type { ApiEnvelope, CrawlRecord } from '../types.js';

const pollCrawls = async (z, bundle, status?: string) => {
  const response = await request<ApiEnvelope<CrawlRecord[]>>(z, bundle, {
    path: `/projects/${pathSegment(bundle.inputData.project_uid)}/crawls`,
    params: { limit: 100 },
  });

  return response.data
    .filter((crawl) => !status || crawl.status === status)
    .map((crawl) => ({
      ...crawl,
      id: crawl.uid,
      project_uid: String(bundle.inputData.project_uid),
    }));
};

export const newCrawl = {
  key: 'new_crawl',
  noun: 'Crawl',
  display: {
    label: 'New Crawl',
    description: 'Triggers when a new crawl is created for a Screpy project.',
  },
  operation: {
    type: 'polling',
    inputFields: [projectField()],
    perform: (z, bundle) => pollCrawls(z, bundle),
    sample: { ...CRAWL_SAMPLE, id: CRAWL_SAMPLE.uid },
    outputFields: [{ key: 'id', label: 'ID', type: 'string' }, ...outputFields.crawl],
  },
} satisfies Trigger;

export const crawlCompleted = {
  key: 'crawl_completed',
  noun: 'Completed Crawl',
  display: {
    label: 'Crawl Completed',
    description: 'Triggers when a crawl completes successfully for a Screpy project.',
  },
  operation: {
    type: 'polling',
    inputFields: [projectField()],
    perform: (z, bundle) => pollCrawls(z, bundle, 'success'),
    sample: { ...CRAWL_SAMPLE, id: CRAWL_SAMPLE.uid },
    outputFields: [{ key: 'id', label: 'ID', type: 'string' }, ...outputFields.crawl],
  },
} satisfies Trigger;
