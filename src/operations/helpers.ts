import type { Bundle, Create, InputField, Search, ZObject } from 'zapier-platform-core';

import { request, requestData, requestList } from '../api.js';
import type { JsonObject } from '../types.js';

interface BaseOperationOptions {
  key: string;
  noun: string;
  label: string;
  description: string;
  inputFields?: InputField[];
  sample: JsonObject;
  outputFields?: readonly Record<string, unknown>[];
}

interface ActionOptions extends BaseOperationOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: (bundle: Bundle) => string;
  params?: (bundle: Bundle, z: ZObject) => Record<string, unknown>;
  body?: (bundle: Bundle, z: ZObject) => JsonObject;
  deleted?: boolean;
  idField?: (data: JsonObject, bundle: Bundle) => string;
}

interface ListActionOptions extends BaseOperationOptions {
  path: (bundle: Bundle) => string;
  params?: (bundle: Bundle, z: ZObject) => Record<string, unknown>;
}

export const action = (options: ActionOptions): Create => ({
  key: options.key,
  noun: options.noun,
  display: {
    label: options.label,
    description: options.description,
  },
  operation: {
    inputFields: options.inputFields ?? [],
    perform: async (z, bundle) => {
      if (options.deleted) {
        await request(z, bundle, {
          method: options.method,
          path: options.path(bundle),
          params: options.params?.(bundle, z),
          body: options.body?.(bundle, z),
        });

        return { success: true };
      }

      return requestData<JsonObject>(z, bundle, {
        method: options.method,
        path: options.path(bundle),
        params: options.params?.(bundle, z),
        body: options.body?.(bundle, z),
      });
    },
    sample: options.sample,
    outputFields: options.outputFields ? ([...options.outputFields] as any) : undefined,
  },
});

export const listAction = (options: ListActionOptions): Create => ({
  key: options.key,
  noun: options.noun,
  display: {
    label: options.label,
    description: options.description,
  },
  operation: {
    inputFields: options.inputFields ?? [],
    perform: (z, bundle) =>
      requestList(z, bundle, {
        path: options.path(bundle),
        params: options.params?.(bundle, z),
      }),
    sample: options.sample,
    outputFields: options.outputFields ? ([...options.outputFields] as any) : undefined,
  },
});

export const search = (options: ActionOptions): Search => ({
  key: options.key,
  noun: options.noun,
  display: {
    label: options.label,
    description: options.description,
  },
  operation: {
    inputFields: options.inputFields ?? [],
    perform: async (z, bundle) => {
      const data = await requestData<JsonObject>(z, bundle, {
        method: options.method,
        path: options.path(bundle),
        params: options.params?.(bundle, z),
        body: options.body?.(bundle, z),
      });

      if (options.idField && data && typeof data === 'object' && !Array.isArray(data)) {
        return [
          {
            ...data,
            id: options.idField(data as JsonObject, bundle),
          },
        ];
      }

      if ('data' in data && data.data === null) {
        return [];
      }

      return [data];
    },
    sample: options.sample,
    outputFields: options.outputFields ? ([...options.outputFields] as any) : undefined,
  },
});
