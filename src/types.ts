export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export interface JsonObject {
  [key: string]: JsonValue | undefined;
}

export interface CursorMeta {
  next_cursor?: string | null;
  prev_cursor?: string | null;
  warnings?: JsonValue;
  notices?: JsonValue;
  range?: string | null;
}

export interface ApiEnvelope<T> {
  data: T;
  meta?: CursorMeta;
  warnings?: JsonValue;
  notices?: JsonValue;
}

export interface ListOutput<T> {
  items: T[];
  next_cursor: string | null;
  warnings?: JsonValue;
  notices?: JsonValue;
  range?: string | null;
}

export interface CrawlRecord extends JsonObject {
  uid: string;
  project_uid?: string;
  status?: string;
  started_at?: string | null;
  finished_at?: string | null;
}

export interface FilterInput {
  field?: string;
  operator?: string;
  value?: string | number | boolean | null;
}
