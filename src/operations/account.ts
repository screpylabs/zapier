import { action } from './helpers.js';

export const getAccount = action({
  key: 'get_account',
  noun: 'Account',
  label: 'Get Account',
  description: 'Gets the authenticated Screpy account context.',
  path: () => '/account',
  sample: {
    plan: 'pro',
    is_paid: true,
    project_count: 3,
    features: { website_audit: true, uptime_monitoring: true },
  },
  outputFields: [
    { key: 'plan', label: 'Plan', type: 'string' },
    { key: 'is_paid', label: 'Paid Account', type: 'boolean' },
    { key: 'project_count', label: 'Project Count', type: 'integer' },
  ],
});

export const getAccountUsage = action({
  key: 'get_account_usage',
  noun: 'Account Usage',
  label: 'Get Account Usage',
  description: 'Gets plan limits, usage, and feature availability for the Screpy account.',
  path: () => '/account/usage',
  sample: {
    plan: 'pro',
    features: { website_audit: true, uptime_monitoring: true },
    limits: {
      project: { limit: 10, used: 3, remaining: 7 },
    },
  },
  outputFields: [{ key: 'plan', label: 'Plan', type: 'string' }],
});
