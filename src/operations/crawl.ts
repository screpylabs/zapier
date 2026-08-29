import { pathSegment } from '../api.js';
import { CRAWL_SAMPLE } from '../constants.js';
import { crawlField, outputFields, paginationFields, projectField } from '../fields.js';
import { action, listAction, search } from './helpers.js';

const crawlFields = [projectField(), crawlField()];

export const listCrawls = listAction({
  key: 'list_crawls',
  noun: 'Crawl List',
  label: 'List Crawls',
  description: 'Lists crawls for a Screpy project, newest first.',
  path: (bundle) => `/projects/${pathSegment(bundle.inputData.project_uid)}/crawls`,
  inputFields: [projectField(), ...paginationFields()],
  sample: { items: [CRAWL_SAMPLE], next_cursor: null },
  outputFields: outputFields.list,
});

export const startCrawl = action({
  key: 'start_crawl',
  noun: 'Crawl',
  label: 'Start Crawl',
  description: 'Starts a new crawl for a Screpy project.',
  method: 'POST',
  path: (bundle) => `/projects/${pathSegment(bundle.inputData.project_uid)}/crawls`,
  inputFields: [projectField()],
  sample: {
    crawl_uid: CRAWL_SAMPLE.uid,
    status: 'queued',
  },
  outputFields: [
    { key: 'crawl_uid', label: 'Crawl UID', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
  ],
});

export const findCrawl = search({
  key: 'find_crawl',
  noun: 'Crawl',
  label: 'Find Crawl',
  description: 'Finds the status and progress of a Screpy crawl.',
  path: (bundle) =>
    `/projects/${pathSegment(bundle.inputData.project_uid)}/crawls/${pathSegment(bundle.inputData.crawl_uid)}`,
  inputFields: crawlFields,
  idField: (data) => String(data.crawl_uid),
  sample: {
    id: CRAWL_SAMPLE.uid,
    crawl_uid: CRAWL_SAMPLE.uid,
    status: 'success',
    state: 'finished',
    status_label: 'Completed',
    progress: {
      pages_crawled: 120,
      pages_total: 120,
      max_pages: 1000,
      current_depth: 3,
    },
  },
  outputFields: [
    { key: 'id', label: 'ID', type: 'string' },
    { key: 'crawl_uid', label: 'Crawl UID', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'state', label: 'State', type: 'string' },
    { key: 'status_label', label: 'Status Label', type: 'string' },
  ],
});

export const getCrawlSummary = action({
  key: 'get_crawl_summary',
  noun: 'Crawl Summary',
  label: 'Get Crawl Summary',
  description: 'Gets the summary for a completed Screpy crawl.',
  path: (bundle) =>
    `/projects/${pathSegment(bundle.inputData.project_uid)}/crawls/${pathSegment(bundle.inputData.crawl_uid)}/summary`,
  inputFields: crawlFields,
  sample: {
    crawl_uid: CRAWL_SAMPLE.uid,
    status: 'success',
    pages_total: 120,
    critical_issues: 2,
    warnings: 8,
    notices: 4,
  },
  outputFields: [
    { key: 'crawl_uid', label: 'Crawl UID', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'pages_total', label: 'Pages Total', type: 'integer' },
    { key: 'critical_issues', label: 'Critical Issues', type: 'integer' },
    { key: 'warnings', label: 'Warnings', type: 'integer' },
    { key: 'notices', label: 'Notices', type: 'integer' },
  ],
});
