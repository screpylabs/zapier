import type { Bundle, HttpMethod, ZObject } from 'zapier-platform-core';

import { API_BASE_URL } from './constants.js';
import type { ApiEnvelope, FilterInput, JsonObject, JsonValue, ListOutput } from './types.js';

interface RequestOptions {
  method?: HttpMethod;
  path: string;
  params?: Record<string, unknown>;
  body?: JsonObject;
}

interface ListOptions {
  path: string;
  params?: Record<string, unknown>;
}

const compact = (value: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ''));

export const pathSegment = (value: unknown): string => encodeURIComponent(String(value));

export const request = async <T>(
  z: ZObject,
  bundle: Bundle,
  options: RequestOptions,
): Promise<T> => {
  const response = await z.request({
    url: `${API_BASE_URL}${options.path}`,
    method: options.method ?? 'GET',
    params: options.params ? compact(options.params) : undefined,
    body: options.body,
  });

  return response.data as T;
};

export const requestData = async <T extends JsonObject>(
  z: ZObject,
  bundle: Bundle,
  options: RequestOptions,
): Promise<T | { data: null }> => {
  const response = await request<ApiEnvelope<T>>(z, bundle, options);

  return response.data === null ? { data: null } : response.data;
};

export const requestList = async <T extends JsonObject>(
  z: ZObject,
  bundle: Bundle,
  options: ListOptions,
): Promise<ListOutput<T>> => {
  const returnAll = bundle.inputData.return_all === true;
  const limit = returnAll ? 100 : Number(bundle.inputData.limit ?? 50);
  let cursor = String(bundle.inputData.starting_cursor ?? '');
  const items: T[] = [];
  let warnings: JsonValue | undefined;
  let notices: JsonValue | undefined;
  let range: string | null | undefined;

  do {
    const response = await request<ApiEnvelope<T[]>>(z, bundle, {
      path: options.path,
      params: {
        ...options.params,
        limit,
        cursor: cursor || undefined,
      },
    });

    items.push(...response.data);
    cursor = response.meta?.next_cursor ?? '';
    warnings = response.meta?.warnings ?? response.warnings ?? warnings;
    notices = response.meta?.notices ?? response.notices ?? notices;
    range = response.meta?.range ?? range;
  } while (returnAll && cursor);

  return {
    items,
    next_cursor: cursor || null,
    warnings,
    notices,
    range,
  };
};

const parseInValues = (value: FilterInput['value']): JsonValue[] => {
  if (typeof value !== 'string') {
    throw new Error('Filter values for In must be a comma-separated list or a JSON array.');
  }

  const trimmed = value.trim();
  let values: JsonValue[];

  if (trimmed.startsWith('[')) {
    let parsed: unknown;

    try {
      parsed = JSON.parse(trimmed) as unknown;
    } catch {
      throw new Error('Filter values must contain a valid JSON array.');
    }

    if (!Array.isArray(parsed)) {
      throw new Error('Filter values must contain a valid JSON array.');
    }

    values = parsed as JsonValue[];
  } else {
    values = trimmed
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (values.length < 1 || values.length > 100) {
    throw new Error('Filter values must contain between 1 and 100 items.');
  }

  return values;
};

export const serializeFilters = (filters: FilterInput[] | undefined): Record<string, unknown> => {
  if (!filters?.length) {
    return {};
  }

  if (filters.length > 20) {
    throw new Error('A request can contain at most 20 filters.');
  }

  const params: Record<string, unknown> = {};

  filters.forEach((filter, index) => {
    const field = filter.field?.trim();
    const operator = filter.operator?.trim();

    if (!field || !operator) {
      throw new Error('Every filter requires a field and an operator.');
    }

    params[`filters[${index}][field]`] = field;
    params[`filters[${index}][operator]`] = operator;

    if (operator === 'in') {
      parseInValues(filter.value).forEach((value, valueIndex) => {
        params[`filters[${index}][value][${valueIndex}]`] = value;
      });

      return;
    }

    if (operator === 'is_null') {
      params[`filters[${index}][value]`] = filter.value === '' ? true : filter.value;
      return;
    }

    if (filter.value === undefined || filter.value === '') {
      throw new Error('Every filter except Is Null requires a value.');
    }

    params[`filters[${index}][value]`] = filter.value;
  });

  return params;
};

export const compactBody = (value: Record<string, unknown>): JsonObject =>
  compact(value) as JsonObject;

export const validationError = (z: ZObject, message: string): never => {
  throw new z.errors.Error(message, 'ValidationError', 400);
};
