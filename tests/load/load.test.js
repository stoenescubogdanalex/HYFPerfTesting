/**
 * Load Test – JSONPlaceholder API
 *
 * Purpose : Simulate normal expected traffic to verify the API handles
 *           a realistic number of concurrent users without degradation.
 * Load    : Ramps up to 10 VUs over 1 min, holds for 3 min, ramps down over 1 min.
 * Run     : k6 run --env BASE_URL=https://jsonplaceholder.typicode.com tests/load/load.test.js
 */

import http from 'k6/http';
import { sleep } from 'k6';
import {
  checkStatus200,
  checkStatus201,
  checkJsonBody,
  checkResponseTime,
} from '../../lib/checks.js';
import { getHeaders, randomPostId, randomUserId } from '../../lib/helpers.js';
import { loadThresholds } from '../../lib/thresholds.js';

const BASE_URL = __ENV.BASE_URL || 'https://jsonplaceholder.typicode.com';

export const options = {
  stages: [
    { duration: '1m', target: 10 }, // ramp up to 10 VUs
    { duration: '3m', target: 10 }, // hold at 10 VUs
    { duration: '1m', target: 0 },  // ramp down to 0
  ],
  thresholds: loadThresholds,
};

export default function () {
  const headers = getHeaders();

  // GET /posts – list all posts
  const listRes = http.get(`${BASE_URL}/posts`, { headers });
  checkStatus200(listRes);
  checkJsonBody(listRes);
  checkResponseTime(listRes, 1000);

  sleep(1);

  // GET /posts/:id – fetch a single post
  const postRes = http.get(`${BASE_URL}/posts/${randomPostId()}`, { headers });
  checkStatus200(postRes);
  checkJsonBody(postRes);

  sleep(1);

  // GET /users/:id – fetch a single user
  const userRes = http.get(`${BASE_URL}/users/${randomUserId()}`, { headers });
  checkStatus200(userRes);
  checkJsonBody(userRes);

  sleep(1);

  // POST /posts – create a new post
  const payload = JSON.stringify({
    title: 'k6 load test post',
    body: 'Automated load test payload',
    userId: randomUserId(),
  });
  const createRes = http.post(`${BASE_URL}/posts`, payload, { headers });
  checkStatus201(createRes);
  checkJsonBody(createRes);

  sleep(1);
}
