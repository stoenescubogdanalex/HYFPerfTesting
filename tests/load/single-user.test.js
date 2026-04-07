/**
 * Single User Test – JSONPlaceholder API
 *
 * Purpose : Verify API functionality with a single virtual user
 *           to establish baseline performance metrics.
 * Load    : 1 virtual user for 1 minute.
 * Run     : k6 run --env BASE_URL=https://jsonplaceholder.typicode.com tests/load/single-user.test.js
 */

import http from 'k6/http';
import { sleep } from 'k6';
import { checkStatus200, checkJsonBody, checkResponseTime } from '../../lib/checks.js';
import { getHeaders, randomPostId } from '../../lib/helpers.js';
import { generateDetailedHtmlReport } from '../../lib/reporter.js';

const BASE_URL = __ENV.BASE_URL || 'https://jsonplaceholder.typicode.com';

export const options = {
  vus: 1,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
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
    testName: 'single-user-test',
    description: 'Single User Baseline Performance Test',
    baseUrl: BASE_URL,
  });
}
