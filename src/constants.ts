export const API_BASE_URL = 'https://api.screpy.com/v1';

export const FILTER_OPERATORS = [
  { label: 'Contains', value: 'contains' },
  { label: 'Equals', value: 'eq' },
  { label: 'Greater Than', value: 'gt' },
  { label: 'Greater Than or Equal', value: 'gte' },
  { label: 'In', value: 'in' },
  { label: 'Is Null', value: 'is_null' },
  { label: 'Less Than', value: 'lt' },
  { label: 'Less Than or Equal', value: 'lte' },
  { label: 'Not Equal', value: 'neq' },
] as const;

export const PAGE_FILTER_FIELDS = [
  ['Canonical', 'canonical'],
  ['Canonical Matches Final URL', 'canonical_matches_final_url'],
  ['Canonical Present', 'canonical_present'],
  ['Content Ratio', 'content_ratio'],
  ['Content Type', 'content_type'],
  ['Depth', 'depth'],
  ['Description', 'description'],
  ['Description Length', 'description_length'],
  ['Domain', 'domain'],
  ['External Links Count', 'external_links_count'],
  ['Fetched At', 'fetched_at'],
  ['Final URL', 'final_url'],
  ['H1', 'h1'],
  ['H1 Count', 'h1_count'],
  ['H2 Count', 'h2_count'],
  ['Internal Links Count', 'internal_links_count'],
  ['JSON-LD Count', 'json_ld_count'],
  ['Missing Alt Images Count', 'missing_alt_images_count'],
  ['OG Required Tags Present', 'og_required_tags_present'],
  ['Response Bytes', 'response_bytes'],
  ['Response Time (Ms)', 'response_time_ms'],
  ['Status Code', 'status_code'],
  ['Title', 'title'],
  ['Title Length', 'title_length'],
  ['Total Images Count', 'total_images_count'],
  ['Total Links Count', 'total_links_count'],
  ['Twitter Card Present', 'twitter_card_present'],
  ['URL', 'url'],
  ['Words Count', 'words_count'],
] as const;

export const LINK_FILTER_FIELDS = [
  ['Anchor Text', 'anchor_text'],
  ['Destination URL', 'destination_url'],
  ['Fetch Status Code', 'fetch_status_code'],
  ['Is External', 'is_external'],
  ['Is Nofollow', 'is_nofollow'],
  ['Source URL', 'source_url'],
  ['Target Blank', 'target_blank'],
  ['Target Domain', 'target_domain'],
] as const;

export const IMAGE_FILTER_FIELDS = [
  ['Alt Text', 'alt'],
  ['Fetch Status Code', 'fetch_status_code'],
  ['Has Srcset', 'has_srcset'],
  ['Height', 'height'],
  ['Image URL', 'image_url'],
  ['Is Data URI', 'is_data_uri'],
  ['Is External', 'is_external'],
  ['Is SVG', 'is_svg'],
  ['Source URL', 'source_url'],
  ['Width', 'width'],
] as const;

export const PROJECT_SAMPLE = {
  uid: 'a1b2c3d4e5f6a7b8',
  name: 'Example Website',
  domain: 'example.com',
  role: 'owner',
  created_at: '2026-08-29T10:00:00Z',
};

export const CRAWL_SAMPLE = {
  uid: 'c1d2e3f4a5b6c7d8',
  project_uid: PROJECT_SAMPLE.uid,
  status: 'success',
  started_at: '2026-08-29T10:00:00Z',
  finished_at: '2026-08-29T10:05:00Z',
};

export const PAGE_SAMPLE = {
  url: 'https://example.com/',
  final_url: 'https://example.com/',
  status_code: 200,
  title: 'Example Website',
};

export const LINK_SAMPLE = {
  destination_url: 'https://example.com/about',
  source_url: 'https://example.com/',
  anchor_text: 'About',
  is_external: false,
};

export const IMAGE_SAMPLE = {
  image_url: 'https://example.com/logo.png',
  source_url: 'https://example.com/',
  alt: 'Example logo',
  is_external: false,
};
