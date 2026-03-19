/**
 * Stress Test – JSONPlaceholder API
 *
 * Purpose : Push the API beyond normal capacity to find its breaking point
 *           and measure behaviour under extreme load.
 * Load    : Ramps from 0 → 50 → 100 VUs and back down over ~16 minutes.
 * Run     : k6 run --env BASE_URL=https://jsonplaceholder.typicode.com tests/stress/stress.test.js
 */

import http from 'k6/http';
import { sleep } from 'k6';
import { checkStatus200, checkJsonBody } from '../../lib/checks.js';
import { getHeaders, randomPostId, randomCommentId } from '../../lib/helpers.js';
import { stressThresholds } from '../../lib/thresholds.js';

const BASE_URL = __ENV.BASE_URL || 'https://jsonplaceholder.typicode.com';

export const options = {
  stages: [
    { duration: '2m', target: 50 },  // ramp up to 50 VUs
    { duration: '5m', target: 50 },  // hold at 50 VUs
    { duration: '2m', target: 100 }, // ramp up to 100 VUs
    { duration: '5m', target: 100 }, // hold at 100 VUs
    { duration: '2m', target: 0 },   // ramp down to 0
  ],
  thresholds: stressThresholds,
};

export default function () {
  const headers = getHeaders();

  // GET /posts – list all posts
  const listRes = http.get(`${BASE_URL}/posts`, { headers });
  checkStatus200(listRes);
  checkJsonBody(listRes);

  sleep(1);

  // GET /posts/:id – fetch a single post
  const postRes = http.get(`${BASE_URL}/posts/${randomPostId()}`, { headers });
  checkStatus200(postRes);
  checkJsonBody(postRes);

  sleep(1);

  // GET /comments/:id – fetch a single comment
  const commentRes = http.get(`${BASE_URL}/comments/${randomCommentId()}`, { headers });
  checkStatus200(commentRes);
  checkJsonBody(commentRes);

  sleep(1);
}
