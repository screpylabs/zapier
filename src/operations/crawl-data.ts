import type { Bundle, InputField, ZObject } from 'zapier-platform-core';

import { pathSegment, serializeFilters, validationError } from '../api.js';
import {
  IMAGE_FILTER_FIELDS,
  IMAGE_SAMPLE,
  LINK_FILTER_FIELDS,
  LINK_SAMPLE,
  PAGE_FILTER_FIELDS,
  PAGE_SAMPLE,
} from '../constants.js';
import {
  crawlField,
  filterField,
  outputFields,
  paginationFields,
  projectField,
} from '../fields.js';
import type { FilterInput } from '../types.js';
import { action, listAction, search } from './helpers.js';

const crawlPath = (bundle: Bundle): string =>
  `/projects/${pathSegment(bundle.inputData.project_uid)}/crawls/${pathSegment(bundle.inputData.crawl_uid)}`;

const crawlFields = (): InputField[] => [projectField(), crawlField()];

const filteredListFields = (fields: readonly (readonly [string, string])[]): InputField[] => [
  ...crawlFields(),
  filterField(fields),
  ...paginationFields(),
];

const filterParams = (bundle: Bundle, z: ZObject): Record<string, unknown> => {
  try {
    return serializeFilters(bundle.inputData.filters as FilterInput[] | undefined);
  } catch (error) {
    return validationError(
      z,
      error instanceof Error ? error.message : 'Screpy could not validate the supplied filters.',
    );
  }
};

export const getOnPageOverview = action({
  key: 'get_on_page_overview',
  noun: 'On-Page Overview',
  label: 'Get On-Page Overview',
  description: 'Gets the on-page audit overview for a completed Screpy crawl.',
  path: (bundle) => `${crawlPath(bundle)}/on-page-overview`,
  inputFields: crawlFields(),
  sample: {
    summary: {
      status: 'success',
      finished_at: '2026-08-29T10:05:00Z',
      health_score: 92,
      health_score_version: 1,
    },
    categories: [],
  },
});

export const listQuickWins = listAction({
  key: 'list_quick_wins',
  noun: 'Quick Win List',
  label: 'Get Quick Wins',
  description: 'Lists prioritized search-performance opportunities for a Screpy crawl.',
  path: (bundle) => `${crawlPath(bundle)}/quick-wins`,
  inputFields: [
    ...crawlFields(),
    {
      key: 'type',
      label: 'Quick Win Type',
      type: 'string',
      choices: {
        strikingDistancePages: 'Striking Distance Pages',
        ctrOpportunities: 'CTR Opportunities',
        cannibalizationRisks: 'Cannibalization Risks',
        contentDecay: 'Content Decay',
        newVisibilityOpportunities: 'New Visibility Opportunities',
        visibilityGrowthClicksFlat: 'Visibility Growth With Flat Clicks',
        newContentOpportunities: 'New Content Opportunities',
        secondPageKeywords: 'Second Page Keywords',
        lostQueries: 'Lost Queries',
        risingQueries: 'Rising Queries',
        fallingQueries: 'Falling Queries',
        risingPages: 'Rising Pages',
        fallingPages: 'Falling Pages',
      },
    },
    {
      key: 'range',
      label: 'Date Range',
      type: 'string',
      choices: {
        '7d': '7 Days',
        '28d': '28 Days',
        '30d': '30 Days',
        '90d': '90 Days',
        '180d': '180 Days',
        '365d': '365 Days',
        '3m': '3 Months',
        '6m': '6 Months',
      },
    },
    ...paginationFields(),
  ],
  params: (bundle) => ({
    type: bundle.inputData.type,
    range: bundle.inputData.range,
  }),
  sample: {
    items: [{ url: 'https://example.com/page', opportunity: 'example' }],
    next_cursor: null,
    warnings: [],
    range: '28d',
  },
  outputFields: [...outputFields.list, { key: 'range', label: 'Date Range', type: 'string' }],
});

export const listPages = listAction({
  key: 'list_pages',
  noun: 'Page List',
  label: 'List Pages',
  description: 'Lists pages discovered in a Screpy crawl.',
  path: (bundle) => `${crawlPath(bundle)}/pages`,
  inputFields: filteredListFields(PAGE_FILTER_FIELDS),
  params: filterParams,
  sample: { items: [PAGE_SAMPLE], next_cursor: null },
  outputFields: outputFields.list,
});

export const findPage = search({
  key: 'find_page',
  noun: 'Page',
  label: 'Find Page',
  description: 'Finds one crawled page by its exact URL.',
  path: (bundle) => `${crawlPath(bundle)}/pages/detail`,
  inputFields: [
    ...crawlFields(),
    {
      key: 'url',
      label: 'Page URL',
      type: 'string',
      required: true,
      placeholder: 'https://example.com/page',
    },
  ],
  params: (bundle) => ({ url: bundle.inputData.url }),
  idField: (data) => String(data.url),
  sample: { ...PAGE_SAMPLE, id: PAGE_SAMPLE.url },
  outputFields: [
    { key: 'id', label: 'ID', type: 'string' },
    { key: 'url', label: 'URL', type: 'string' },
    { key: 'final_url', label: 'Final URL', type: 'string' },
    { key: 'status_code', label: 'Status Code', type: 'integer' },
    { key: 'title', label: 'Title', type: 'string' },
  ],
});

export const listLinks = listAction({
  key: 'list_links',
  noun: 'Link List',
  label: 'List Links',
  description: 'Lists unique link destinations discovered in a Screpy crawl.',
  path: (bundle) => `${crawlPath(bundle)}/links`,
  inputFields: filteredListFields(LINK_FILTER_FIELDS),
  params: filterParams,
  sample: { items: [LINK_SAMPLE], next_cursor: null },
  outputFields: outputFields.list,
});

export const listLinkSources = listAction({
  key: 'list_link_sources',
  noun: 'Link Source List',
  label: 'List Link Sources',
  description: 'Lists pages that link to a destination URL in a Screpy crawl.',
  path: (bundle) => `${crawlPath(bundle)}/links/sources`,
  inputFields: [
    ...crawlFields(),
    {
      key: 'destination_url',
      label: 'Destination URL',
      type: 'string',
      required: true,
      placeholder: 'https://example.com/about',
    },
    ...paginationFields(),
  ],
  params: (bundle) => ({ destination_url: bundle.inputData.destination_url }),
  sample: {
    items: [{ source_url: 'https://example.com/', source_status_code: 200 }],
    next_cursor: null,
  },
  outputFields: outputFields.list,
});

export const listImages = listAction({
  key: 'list_images',
  noun: 'Image List',
  label: 'List Images',
  description: 'Lists unique images discovered in a Screpy crawl.',
  path: (bundle) => `${crawlPath(bundle)}/images`,
  inputFields: filteredListFields(IMAGE_FILTER_FIELDS),
  params: filterParams,
  sample: { items: [IMAGE_SAMPLE], next_cursor: null },
  outputFields: outputFields.list,
});

export const listImageSources = listAction({
  key: 'list_image_sources',
  noun: 'Image Source List',
  label: 'List Image Sources',
  description: 'Lists pages that reference an image URL in a Screpy crawl.',
  path: (bundle) => `${crawlPath(bundle)}/images/sources`,
  inputFields: [
    ...crawlFields(),
    {
      key: 'image_url',
      label: 'Image URL',
      type: 'string',
      required: true,
      placeholder: 'https://example.com/logo.png',
    },
    ...paginationFields(),
  ],
  params: (bundle) => ({ image_url: bundle.inputData.image_url }),
  sample: {
    items: [{ source_url: 'https://example.com/', source_status_code: 200 }],
    next_cursor: null,
  },
  outputFields: outputFields.list,
});
