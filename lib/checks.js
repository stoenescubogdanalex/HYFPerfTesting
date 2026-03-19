import { check } from 'k6';

/**
 * Checks that the HTTP response status is 200 OK.
 * @param {object} response - k6 HTTP response object
 * @returns {boolean}
 */
export function checkStatus200(response) {
  return check(response, {
    'status is 200': (r) => r.status === 200,
  });
}

/**
 * Checks that the HTTP response status is 201 Created.
 * @param {object} response - k6 HTTP response object
 * @returns {boolean}
 */
export function checkStatus201(response) {
  return check(response, {
    'status is 201': (r) => r.status === 201,
  });
}

/**
 * Checks that the response time is below the given threshold.
 * @param {object} response - k6 HTTP response object
 * @param {number} maxMs - maximum allowed duration in milliseconds (default 500)
 * @returns {boolean}
 */
export function checkResponseTime(response, maxMs = 500) {
  return check(response, {
    [`response time < ${maxMs}ms`]: (r) => r.timings.duration < maxMs,
  });
}

/**
 * Checks that the response body is non-empty and valid JSON.
 * @param {object} response - k6 HTTP response object
 * @returns {boolean}
 */
export function checkJsonBody(response) {
  return check(response, {
    'response has body': (r) => r.body != null && r.body.length > 0,
    'response is valid JSON': (r) => {
      if (r.body == null || r.body.length === 0) return false;
      try {
        const parsed = JSON.parse(r.body);
        return parsed !== null && parsed !== undefined;
      } catch (_) {
        return false;
      }
    },
  });
}
