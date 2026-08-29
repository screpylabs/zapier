import type { Bundle, InputField, ZObject } from 'zapier-platform-core';

import { compactBody, validationError } from '../api.js';
import { CRAWL_SAMPLE, PROJECT_SAMPLE } from '../constants.js';
import { crawlField, projectField } from '../fields.js';
import type { JsonObject } from '../types.js';
import { action } from './helpers.js';

const projectComparisonFields: InputField[] = [];

for (let index = 1; index <= 5; index += 1) {
  const required = index <= 2;
  const projectKey = `project_uid_${index}`;

  projectComparisonFields.push(
    projectField(projectKey, `Project ${index}`, required),
    crawlField(`crawl_uid_${index}`, `Project ${index} Crawl`, false, projectKey),
  );
}

const compareProjectsBody = (bundle: Bundle, z: ZObject): JsonObject => {
  const projects = Array.from({ length: 5 }, (_, offset) => {
    const index = offset + 1;
    const projectUid = bundle.inputData[`project_uid_${index}`];
    const crawlUid = bundle.inputData[`crawl_uid_${index}`];

    return projectUid
      ? {
          project_uid: String(projectUid),
          crawl_uid: crawlUid ? String(crawlUid) : undefined,
        }
      : null;
  }).filter(
    (selection): selection is { project_uid: string; crawl_uid: string | undefined } =>
      selection !== null,
  );

  if (projects.length < 2 || projects.length > 5) {
    validationError(z, 'Select between two and five projects.');
  }

  const uniqueProjects = new Set(projects.map(({ project_uid }) => project_uid));

  if (uniqueProjects.size !== projects.length) {
    validationError(z, 'Each compared project must be different.');
  }

  const crawlSelections = projects
    .filter((selection) => selection.crawl_uid)
    .map(({ project_uid, crawl_uid }) => ({ project_uid, crawl_uid: String(crawl_uid) }));

  return compactBody({
    project_uids: projects.map(({ project_uid }) => project_uid),
    crawl_selections: crawlSelections.length ? crawlSelections : undefined,
  });
};

const crawlComparisonFields: InputField[] = [
  projectField('first_project_uid', 'First Project'),
  crawlField('first_crawl_uid', 'First Crawl', true, 'first_project_uid'),
  projectField('second_project_uid', 'Second Project'),
  crawlField('second_crawl_uid', 'Second Crawl', true, 'second_project_uid'),
];

const compareCrawlsBody = (bundle: Bundle, z: ZObject): JsonObject => {
  if (bundle.inputData.first_crawl_uid === bundle.inputData.second_crawl_uid) {
    validationError(z, 'The first and second crawl must be different.');
  }

  return {
    first: {
      project_uid: String(bundle.inputData.first_project_uid),
      crawl_uid: String(bundle.inputData.first_crawl_uid),
    },
    second: {
      project_uid: String(bundle.inputData.second_project_uid),
      crawl_uid: String(bundle.inputData.second_crawl_uid),
    },
  };
};

export const compareProjects = action({
  key: 'compare_projects',
  noun: 'Project Comparison',
  label: 'Compare Projects',
  description: 'Compares two to five Screpy projects using selected or latest crawls.',
  method: 'POST',
  path: () => '/comparisons/projects',
  inputFields: projectComparisonFields,
  body: compareProjectsBody,
  sample: {
    projects: [
      { project_uid: PROJECT_SAMPLE.uid, name: PROJECT_SAMPLE.name },
      { project_uid: 'b1c2d3e4f5a6b7c8', name: 'Comparison Website' },
    ],
    metrics: {},
  },
});

export const compareCrawls = action({
  key: 'compare_crawls',
  noun: 'Crawl Comparison',
  label: 'Compare Crawls',
  description: 'Compares two completed Screpy crawls.',
  method: 'POST',
  path: () => '/comparisons/crawls',
  inputFields: crawlComparisonFields,
  body: compareCrawlsBody,
  sample: {
    first: { crawl_uid: CRAWL_SAMPLE.uid },
    second: { crawl_uid: 'd1e2f3a4b5c6d7e8' },
    deltas: {},
  },
});
