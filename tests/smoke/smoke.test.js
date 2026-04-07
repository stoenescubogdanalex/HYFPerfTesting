/**
 * Smoke Test – JSONPlaceholder API
 *
 * Purpose : Quick sanity check to confirm the API is up and responding correctly
 *           before running heavier test scenarios.
 * Load    : 1 virtual user for 30 seconds.
 * Run     : k6 run --env BASE_URL=https://jsonplaceholder.typicode.com tests/smoke/smoke.test.js
 */

import http from 'k6/http';
import { sleep } from 'k6';
import { checkStatus200, checkJsonBody, checkResponseTime } from '../../lib/checks.js';
import { getHeaders, randomPostId } from '../../lib/helpers.js';
import { smokeThresholds } from '../../lib/thresholds.js';
import { generateDetailedHtmlReport } from '../../lib/reporter.js';

const BASE_URL = __ENV.BASE_URL || 'https://jsonplaceholder.typicode.com';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: smokeThresholds,
};

export default function () {
  const headers = getHeaders();

  // GET /posts – list all posts
  const listRes = http.get(`${BASE_URL}/posts`, { headers });
  checkStatus200(listRes);
  checkJsonBody(listRes);
  checkResponseTime(listRes, 500);

  sleep(1);

  // GET /posts/:id – fetch a single post
  const postRes = http.get(`${BASE_URL}/posts/${randomPostId()}`, { headers });
  checkStatus200(postRes);
  checkJsonBody(postRes);
  checkResponseTime(postRes, 500);

  sleep(1);
}

export function handleSummary(data) {
  return generateDetailedHtmlReport(data, {
    testName: 'smoke-test',
    description: 'API Smoke Test - Quick Sanity Check',
    baseUrl: BASE_URL,
  });
}
