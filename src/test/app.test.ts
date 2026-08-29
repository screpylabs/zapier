import { describe, expect, it } from 'vitest';

import App, { creates, searches, triggers } from '../index.js';

describe('Screpy app definition', () => {
  it('registers every planned component', () => {
    expect(Object.keys(creates)).toHaveLength(20);
    expect(Object.keys(searches)).toHaveLength(3);
    expect(Object.keys(triggers)).toHaveLength(2);
    expect(Object.keys(App.creates ?? {})).toEqual(Object.keys(creates));
    expect(Object.keys(App.searches ?? {})).toEqual(Object.keys(searches));
    expect(Object.keys(App.triggers ?? {})).toEqual(Object.keys(triggers));
  });

  it('uses unique keys that match their registry keys', () => {
    const registries = [creates, searches, triggers];
    const keys = registries.flatMap((registry) => Object.keys(registry));

    expect(new Set(keys).size).toBe(25);

    registries.forEach((registry) => {
      Object.entries(registry).forEach(([key, component]) => {
        expect(component.key).toBe(key);
      });
    });
  });

  it('uses a safe, descriptive authentication label and links to API key documentation', () => {
    expect(App.authentication?.connectionLabel).toContain('{{plan}}');
    expect(App.authentication?.connectionLabel).not.toContain('api_key');
    expect(App.authentication?.fields?.[0]?.helpText).toContain(
      'https://screpy.com/docs/api/authentication',
    );
  });
});
