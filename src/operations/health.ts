import { pathSegment } from '../api.js';
import { projectField } from '../fields.js';
import { action } from './helpers.js';

export const getCoreWebVitals = action({
  key: 'get_core_web_vitals',
  noun: 'Core Web Vitals',
  label: 'Get Core Web Vitals',
  description: 'Gets the latest Core Web Vitals data for a Screpy project.',
  path: (bundle) => `/projects/${pathSegment(bundle.inputData.project_uid)}/core-web-vitals`,
  inputFields: [projectField()],
  sample: {
    url: 'https://example.com/',
    last_checked_at: '2026-08-29T10:00:00Z',
    metrics: {
      lcp: { value: 1.8 },
      cls: { value: 0.04 },
    },
  },
  outputFields: [
    { key: 'url', label: 'URL', type: 'string' },
    { key: 'last_checked_at', label: 'Last Checked At', type: 'datetime' },
  ],
});

export const getUptime = action({
  key: 'get_uptime',
  noun: 'Uptime',
  label: 'Get Uptime',
  description: 'Gets uptime summary and recent checks for a Screpy project.',
  path: (bundle) => `/projects/${pathSegment(bundle.inputData.project_uid)}/uptime`,
  inputFields: [projectField()],
  sample: {
    summary: {
      current_status: 'up',
      uptime_percentage: 99.99,
      avg_response_time_ms: 240,
      last_checked_at: '2026-08-29T10:00:00Z',
    },
    rows: [
      {
        label: 'Aug 29, 13:00',
        status: 'up',
        response_time_ms: 230,
        checked_at: '2026-08-29T10:00:00Z',
      },
    ],
  },
});
