/**
 * Returns common HTTP headers for JSON API requests.
 * @returns {object}
 */
export function getHeaders() {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

/**
 * Returns a random post ID between 1 and 100 (JSONPlaceholder range).
 * @returns {number}
 */
export function randomPostId() {
  return Math.floor(Math.random() * 100) + 1;
}

/**
 * Returns a random user ID between 1 and 10 (JSONPlaceholder range).
 * @returns {number}
 */
export function randomUserId() {
  return Math.floor(Math.random() * 10) + 1;
}

/**
 * Returns a random comment ID between 1 and 500 (JSONPlaceholder range).
 * @returns {number}
 */
export function randomCommentId() {
  return Math.floor(Math.random() * 500) + 1;
}
