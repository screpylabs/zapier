import type { PlainOutputField, Trigger } from 'zapier-platform-core';

import { getCrawlChoicesFor, getProjectChoices, projectField } from '../fields.js';

const choiceOutputFields: PlainOutputField[] = [
  { key: 'id', label: 'ID', type: 'string' },
  { key: 'label', label: 'Label', type: 'string' },
];

const performProjectChoices = async (...args: Parameters<typeof getProjectChoices>) =>
  (await getProjectChoices(...args)).results;

const performCrawlChoices = (projectKey: string) => {
  const getChoices = getCrawlChoicesFor(projectKey);

  return async (...args: Parameters<typeof getChoices>) => (await getChoices(...args)).results;
};

export const projectChoices = {
  key: 'project_choices',
  noun: 'Project',
  display: {
    label: 'Project Choices',
    description: 'Supplies Screpy projects to dynamic dropdown fields.',
    hidden: true,
  },
  operation: {
    type: 'polling',
    perform: performProjectChoices,
    sample: { id: 'a1b2c3d4e5f6g7h8', label: 'Example Project (example.com)' },
    outputFields: choiceOutputFields,
  },
} satisfies Trigger;

const crawlChoiceTrigger = (key: string, projectKey: string, projectLabel: string): Trigger => ({
  key,
  noun: 'Crawl',
  display: {
    label: `${projectLabel} Crawl Choices`,
    description: 'Supplies Screpy crawls to dynamic dropdown fields.',
    hidden: true,
  },
  operation: {
    type: 'polling',
    inputFields: [projectField(projectKey, projectLabel)],
    perform: performCrawlChoices(projectKey),
    sample: { id: 'h8g7f6e5d4c3b2a1', label: 'h8g7f6e5d4c3b2a1 — success' },
    outputFields: choiceOutputFields,
  },
});

export const crawlChoices = crawlChoiceTrigger('crawl_choices', 'project_uid', 'Project');
export const firstCrawlChoices = crawlChoiceTrigger(
  'first_crawl_choices',
  'first_project_uid',
  'First Project',
);
export const secondCrawlChoices = crawlChoiceTrigger(
  'second_crawl_choices',
  'second_project_uid',
  'Second Project',
);

export const comparisonCrawlChoices = [1, 2, 3, 4, 5].map((index) =>
  crawlChoiceTrigger(`project_${index}_crawl_choices`, `project_uid_${index}`, `Project ${index}`),
);
