/**
 * Thresholds for smoke tests.
 * Minimal load – tight response time limits, near-zero failure tolerance.
 */
export const smokeThresholds = {
  http_req_duration: ['p(95)<500'],
  http_req_failed: ['rate<0.01'],
};

/**
 * Thresholds for load tests.
 * Normal expected traffic – moderate response time limits, low failure tolerance.
 */
export const loadThresholds = {
  http_req_duration: ['p(95)<1000', 'p(99)<2000'],
  http_req_failed: ['rate<0.05'],
};

/**
 * Thresholds for stress tests.
 * Beyond normal capacity – relaxed response time limits, higher failure tolerance.
 */
export const stressThresholds = {
  http_req_duration: ['p(95)<3000'],
  http_req_failed: ['rate<0.10'],
};
