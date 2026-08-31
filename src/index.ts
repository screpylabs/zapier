import zapier, { defineApp } from 'zapier-platform-core';

import packageJson from '../package.json' with { type: 'json' };
import authentication from './authentication.js';
import { befores, afters } from './middleware.js';
import { getAccount, getAccountUsage } from './operations/account.js';
import { compareCrawls, compareProjects } from './operations/comparison.js';
import { findCrawl, getCrawlSummary, listCrawls, startCrawl } from './operations/crawl.js';
import {
  findPage,
  getOnPageOverview,
  listImages,
  listImageSources,
  listLinks,
  listLinkSources,
  listPages,
  listQuickWins,
} from './operations/crawl-data.js';
import { getCoreWebVitals, getUptime } from './operations/health.js';
import {
  createProject,
  deleteProject,
  findProject,
  listProjects,
  updateProject,
} from './operations/project.js';
import {
  comparisonCrawlChoices,
  crawlChoices,
  firstCrawlChoices,
  projectChoices,
  secondCrawlChoices,
} from './triggers/choices.js';
import { crawlCompleted, newCrawl } from './triggers/crawls.js';

export const triggers = {
  [newCrawl.key]: newCrawl,
  [crawlCompleted.key]: crawlCompleted,
  [projectChoices.key]: projectChoices,
  [crawlChoices.key]: crawlChoices,
  [firstCrawlChoices.key]: firstCrawlChoices,
  [secondCrawlChoices.key]: secondCrawlChoices,
  ...Object.fromEntries(comparisonCrawlChoices.map((trigger) => [trigger.key, trigger])),
};

export const searches = {
  [findProject.key]: findProject,
  [findCrawl.key]: findCrawl,
  [findPage.key]: findPage,
};

export const creates = {
  [getAccount.key]: getAccount,
  [getAccountUsage.key]: getAccountUsage,
  [compareCrawls.key]: compareCrawls,
  [compareProjects.key]: compareProjects,
  [listCrawls.key]: listCrawls,
  [getCrawlSummary.key]: getCrawlSummary,
  [startCrawl.key]: startCrawl,
  [listImageSources.key]: listImageSources,
  [listImages.key]: listImages,
  [listLinkSources.key]: listLinkSources,
  [listLinks.key]: listLinks,
  [getOnPageOverview.key]: getOnPageOverview,
  [listPages.key]: listPages,
  [listQuickWins.key]: listQuickWins,
  [getCoreWebVitals.key]: getCoreWebVitals,
  [getUptime.key]: getUptime,
  [createProject.key]: createProject,
  [listProjects.key]: listProjects,
  [updateProject.key]: updateProject,
  [deleteProject.key]: deleteProject,
};

export default defineApp({
  version: packageJson.version,
  platformVersion: zapier.version,
  authentication,
  beforeRequest: [...befores],
  afterResponse: [...afters],
  flags: {
    cleanInputData: false,
  },
  triggers,
  searches,
  creates,
});
