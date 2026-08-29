import type { Authentication, Bundle, ZObject } from 'zapier-platform-core';

import { API_BASE_URL } from './constants.js';

const test = async (z: ZObject, _bundle: Bundle) => {
  const response = await z.request({
    url: `${API_BASE_URL}/account`,
  });

  return response.data.data;
};

export default {
  type: 'custom',
  fields: [
    {
      key: 'api_key',
      label: 'API Key',
      type: 'password',
      required: true,
      helpText:
        'Create a REST API key in Screpy under Settings > Connected Apps. See https://screpy.com/docs/api/authentication. Use a read-and-write key for actions that change data.',
    },
  ],
  test,
  connectionLabel: 'Screpy {{plan}} account ({{project_count}} projects)',
} satisfies Authentication;
