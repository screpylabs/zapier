import type { Bundle, InputField, ZObject } from 'zapier-platform-core';

import { compactBody, pathSegment, validationError } from '../api.js';
import { PROJECT_SAMPLE } from '../constants.js';
import { outputFields, paginationFields, projectField } from '../fields.js';
import type { JsonObject } from '../types.js';
import { action, listAction, search } from './helpers.js';

const createProjectFields: InputField[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'string',
    required: true,
    helpText: 'Display name for the Screpy project.',
  },
  {
    key: 'domain',
    label: 'Domain',
    type: 'string',
    required: true,
    placeholder: 'example.com',
    helpText: 'Reachable hostname without a path.',
  },
  { key: 'country', label: 'Country', type: 'string', placeholder: 'US' },
  { key: 'language', label: 'Language', type: 'string', placeholder: 'en' },
  { key: 'timezone', label: 'Timezone', type: 'string', placeholder: 'Europe/London' },
  {
    key: 'crawler_max_urls',
    label: 'Crawler Max URLs',
    type: 'integer',
    default: '1000',
    helpText: 'Must be allowed by the account crawler-page allowance.',
  },
  { key: 'crawler_depth', label: 'Crawler Depth', type: 'integer', default: '3' },
  {
    key: 'crawler_follow_links',
    label: 'Crawler Follow Links',
    type: 'boolean',
    default: 'true',
  },
  {
    key: 'crawler_allow_external_links',
    label: 'Crawler Allow External Links',
    type: 'boolean',
    default: 'false',
  },
  {
    key: 'crawler_connect_images',
    label: 'Crawler Connect Images',
    type: 'boolean',
    default: 'true',
  },
  {
    key: 'crawler_connect_links',
    label: 'Crawler Connect Links',
    type: 'boolean',
    default: 'true',
  },
  {
    key: 'uptime_enabled',
    label: 'Uptime Enabled',
    type: 'boolean',
    default: 'false',
  },
  {
    key: 'notification_email',
    label: 'Notification Email',
    type: 'string',
    placeholder: 'alerts@example.com',
  },
];

const updateProjectFields: InputField[] = [
  projectField(),
  { key: 'name', label: 'Name', type: 'string' },
  { key: 'country', label: 'Country', type: 'string', placeholder: 'US' },
  { key: 'language', label: 'Language', type: 'string', placeholder: 'en' },
  { key: 'timezone', label: 'Timezone', type: 'string', placeholder: 'Europe/London' },
  { key: 'crawler_enabled', label: 'Crawler Enabled', type: 'boolean' },
  { key: 'crawler_max_urls', label: 'Crawler Max URLs', type: 'integer' },
  { key: 'crawler_depth', label: 'Crawler Depth', type: 'integer' },
  {
    key: 'crawler_concurrency',
    label: 'Crawler Concurrency',
    type: 'integer',
    choices: { 1: '1', 2: '2', 5: '5', 10: '10', 20: '20' },
  },
  {
    key: 'crawler_delay_seconds',
    label: 'Crawler Delay Seconds',
    type: 'integer',
    choices: { 0: '0', 1: '1', 5: '5', 10: '10', 30: '30', 60: '60' },
  },
  { key: 'crawler_follow_links', label: 'Crawler Follow Links', type: 'boolean' },
  {
    key: 'crawler_allow_external_links',
    label: 'Crawler Allow External Links',
    type: 'boolean',
  },
  {
    key: 'crawler_javascript_enabled',
    label: 'Crawler JavaScript Enabled',
    type: 'boolean',
  },
  { key: 'crawler_connect_images', label: 'Crawler Connect Images', type: 'boolean' },
  { key: 'crawler_connect_links', label: 'Crawler Connect Links', type: 'boolean' },
  {
    key: 'rank_tracker_frequency',
    label: 'Rank Tracker Frequency',
    type: 'string',
    choices: {
      daily: 'Daily',
      weekly: 'Weekly',
      biweekly: 'Biweekly',
      monthly: 'Monthly',
    },
  },
  {
    key: 'map_tracker_frequency',
    label: 'Map Tracker Frequency',
    type: 'string',
    choices: {
      daily: 'Daily',
      weekly: 'Weekly',
      biweekly: 'Biweekly',
      monthly: 'Monthly',
    },
    helpText: 'Daily availability depends on the Screpy plan.',
  },
  { key: 'uptime_enabled', label: 'Uptime Enabled', type: 'boolean' },
  {
    key: 'uptime_check_interval_minutes',
    label: 'Uptime Check Interval Minutes',
    type: 'integer',
  },
  {
    key: 'notification_email',
    label: 'Notification Email',
    type: 'string',
    placeholder: 'alerts@example.com',
  },
  {
    key: 'map_tracker_match_rules_mode',
    label: 'Map Tracker Match Rules Update',
    type: 'string',
    default: 'unchanged',
    choices: {
      unchanged: 'Unchanged',
      clear: 'Clear',
      replace: 'Replace',
    },
    helpText: 'Keep, clear, or replace the current map tracker match rules.',
  },
  {
    key: 'map_tracker_match_rules',
    label: 'Map Tracker Match Rules',
    children: [
      {
        key: 'field',
        label: 'Field',
        type: 'string',
        choices: {
          address: 'Address',
          place_id: 'Place ID',
          title: 'Title',
          website_domain: 'Website Domain',
          website_url: 'Website URL',
        },
      },
      {
        key: 'operator',
        label: 'Operator',
        type: 'string',
        choices: { contains: 'Contains', equals: 'Equals' },
      },
      { key: 'value', label: 'Value', type: 'string' },
    ],
  },
];

const projectBody = (bundle: Bundle): JsonObject =>
  compactBody({
    name: bundle.inputData.name,
    domain: bundle.inputData.domain,
    country: bundle.inputData.country,
    language: bundle.inputData.language,
    timezone: bundle.inputData.timezone,
    crawler_enabled: bundle.inputData.crawler_enabled,
    crawler_max_urls: bundle.inputData.crawler_max_urls,
    crawler_depth: bundle.inputData.crawler_depth,
    crawler_concurrency: bundle.inputData.crawler_concurrency,
    crawler_delay_seconds: bundle.inputData.crawler_delay_seconds,
    crawler_follow_links: bundle.inputData.crawler_follow_links,
    crawler_allow_external_links: bundle.inputData.crawler_allow_external_links,
    crawler_javascript_enabled: bundle.inputData.crawler_javascript_enabled,
    crawler_connect_images: bundle.inputData.crawler_connect_images,
    crawler_connect_links: bundle.inputData.crawler_connect_links,
    rank_tracker_frequency: bundle.inputData.rank_tracker_frequency,
    map_tracker_frequency: bundle.inputData.map_tracker_frequency,
    uptime_enabled: bundle.inputData.uptime_enabled,
    uptime_check_interval_minutes: bundle.inputData.uptime_check_interval_minutes,
    notification_email: bundle.inputData.notification_email,
  });

const updateProjectBody = (bundle: Bundle, z: ZObject): JsonObject => {
  const body = projectBody(bundle);
  const mode = bundle.inputData.map_tracker_match_rules_mode ?? 'unchanged';

  if (mode === 'clear') {
    body.map_tracker_match_rules = null;
  }

  if (mode === 'replace') {
    const rules = bundle.inputData.map_tracker_match_rules;

    if (!Array.isArray(rules) || rules.length < 1 || rules.length > 10) {
      validationError(z, 'Replace requires between 1 and 10 map tracker match rules.');
    }

    const ruleList = rules as unknown[];

    if (
      ruleList.some(
        (rule) =>
          !rule ||
          typeof rule !== 'object' ||
          !('field' in rule) ||
          !('operator' in rule) ||
          !('value' in rule),
      )
    ) {
      validationError(z, 'Each map tracker match rule requires a field, operator, and value.');
    }

    body.map_tracker_match_rules = ruleList as JsonObject[];
  }

  if (Object.keys(body).length === 0) {
    validationError(z, 'Select at least one project field to update.');
  }

  return body;
};

export const createProject = action({
  key: 'create_project',
  noun: 'Project',
  label: 'Create Project',
  description: 'Creates a new Screpy project.',
  method: 'POST',
  path: () => '/projects',
  inputFields: createProjectFields,
  body: projectBody,
  sample: PROJECT_SAMPLE,
  outputFields: outputFields.project,
});

export const listProjects = listAction({
  key: 'list_projects',
  noun: 'Project List',
  label: 'List Projects',
  description: 'Lists the Screpy projects available to the connected API key.',
  path: () => '/projects',
  inputFields: paginationFields(),
  sample: { items: [PROJECT_SAMPLE], next_cursor: null },
  outputFields: outputFields.list,
});

export const findProject = search({
  key: 'find_project',
  noun: 'Project',
  label: 'Find Project',
  description: 'Finds a Screpy project by its project UID.',
  path: (bundle) => `/projects/${pathSegment(bundle.inputData.project_uid)}`,
  inputFields: [projectField()],
  idField: (data) => String(data.uid),
  sample: { ...PROJECT_SAMPLE, id: PROJECT_SAMPLE.uid },
  outputFields: outputFields.project,
});

export const updateProject = action({
  key: 'update_project',
  noun: 'Project',
  label: 'Update Project',
  description: 'Updates supported settings for a Screpy project.',
  method: 'PATCH',
  path: (bundle) => `/projects/${pathSegment(bundle.inputData.project_uid)}`,
  inputFields: updateProjectFields,
  body: updateProjectBody,
  sample: PROJECT_SAMPLE,
  outputFields: outputFields.project,
});

export const deleteProject = action({
  key: 'delete_project',
  noun: 'Project',
  label: 'Delete Project',
  description: 'Permanently deletes an owned Screpy project.',
  method: 'DELETE',
  path: (bundle) => `/projects/${pathSegment(bundle.inputData.project_uid)}`,
  inputFields: [
    projectField(),
    {
      key: 'confirm_delete',
      label: 'Confirm Permanent Deletion',
      type: 'boolean',
      required: true,
      helpText: 'This operation permanently deletes the project and cannot be undone.',
    },
  ],
  body: (bundle, z) => {
    if (bundle.inputData.confirm_delete !== true) {
      validationError(z, 'Confirm permanent deletion before deleting the project.');
    }

    return {};
  },
  deleted: true,
  sample: { success: true },
  outputFields: [{ key: 'success', label: 'Success', type: 'boolean' }],
});
