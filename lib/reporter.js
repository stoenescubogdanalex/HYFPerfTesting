import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

/**
 * Generates an HTML report and saves it to the results folder.
 * This function is designed to be used with k6's handleSummary() lifecycle hook.
 *
 * @param {object} data - k6 summary data object
 * @param {string} testName - Name of the test (used in filename)
 * @returns {object} - Object mapping file paths to report content
 *
 * @example
 * export function handleSummary(data) {
 *   return generateHtmlReport(data, 'smoke-test');
 * }
 */
export function generateHtmlReport(data, testName = 'test') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `${testName}-${timestamp}.html`;
  
  return {
    [`results/${filename}`]: htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

/**
 * Generates a custom HTML report with additional styling and test metadata.
 * 
 * @param {object} data - k6 summary data object
 * @param {object} options - Report options
 * @param {string} options.testName - Name of the test
 * @param {string} options.description - Test description
 * @param {string} options.baseUrl - Base URL being tested
 * @returns {object} - Object mapping file paths to report content
 */
export function generateDetailedHtmlReport(data, options = {}) {
  const {
    testName = 'k6-test',
    description = 'Performance Test Report',
    baseUrl = 'N/A',
  } = options;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `${testName}-${timestamp}.html`;
  const reportDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const metrics = data.metrics;
  const thresholds = data.root_group?.checks || [];

  // Generate HTML content
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${testName} - Performance Test Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: #f5f5f5;
      color: #333;
      line-height: 1.6;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 2em;
      margin-bottom: 10px;
    }
    .header p {
      font-size: 1.1em;
      opacity: 0.9;
    }
    .meta-info {
      background: #f8f9fa;
      padding: 20px 30px;
      border-bottom: 1px solid #e9ecef;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
    }
    .meta-label {
      font-size: 0.85em;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .meta-value {
      font-size: 1.1em;
      font-weight: 600;
      color: #495057;
    }
    .content {
      padding: 30px;
    }
    .section {
      margin-bottom: 40px;
    }
    .section h2 {
      font-size: 1.5em;
      color: #495057;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #667eea;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .metric-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      border-left: 4px solid #667eea;
    }
    .metric-card.success {
      border-left-color: #28a745;
    }
    .metric-card.warning {
      border-left-color: #ffc107;
    }
    .metric-card.error {
      border-left-color: #dc3545;
    }
    .metric-name {
      font-size: 0.9em;
      color: #6c757d;
      margin-bottom: 8px;
      font-weight: 500;
    }
    .metric-value {
      font-size: 1.8em;
      font-weight: 700;
      color: #495057;
    }
    .metric-details {
      font-size: 0.85em;
      color: #6c757d;
      margin-top: 10px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 5px;
    }
    .metric-detail {
      display: flex;
      justify-content: space-between;
    }
    .table-container {
      overflow-x: auto;
      margin-top: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }
    th, td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #e9ecef;
    }
    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    tr:hover {
      background: #f8f9fa;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.85em;
      font-weight: 600;
    }
    .status-pass {
      background: #d4edda;
      color: #155724;
    }
    .status-fail {
      background: #f8d7da;
      color: #721c24;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px 30px;
      text-align: center;
      color: #6c757d;
      font-size: 0.9em;
      border-top: 1px solid #e9ecef;
    }
    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-card.green {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    }
    .stat-card.red {
      background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
    }
    .stat-card.blue {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    .stat-value {
      font-size: 2.5em;
      font-weight: 700;
      margin-bottom: 5px;
    }
    .stat-label {
      font-size: 0.9em;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${testName}</h1>
      <p>${description}</p>
    </div>

    <div class="meta-info">
      <div class="meta-item">
        <span class="meta-label">Test Date</span>
        <span class="meta-value">${reportDate}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Base URL</span>
        <span class="meta-value">${baseUrl}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Duration</span>
        <span class="meta-value">${formatDuration(data.state?.testRunDurationMs || 0)}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Max VUs</span>
        <span class="meta-value">${metrics.vus_max?.values?.max || 'N/A'}</span>
      </div>
    </div>

    <div class="content">
      ${generateSummarySection(data)}
      ${generateMetricsSection(metrics)}
      ${generateThresholdsSection(data)}
    </div>

    <div class="footer">
      <p>Generated by k6 Performance Testing Framework</p>
      <p>Report generated on ${reportDate}</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return {
    [`results/${filename}`]: htmlContent,
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

/**
 * Helper function to format duration in a human-readable format
 */
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Helper function to format numbers with appropriate precision
 */
function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined) return 'N/A';
  return typeof num === 'number' ? num.toFixed(decimals) : num;
}

/**
 * Generate summary statistics section
 */
function generateSummarySection(data) {
  const metrics = data.metrics;
  const totalRequests = metrics.http_reqs?.values?.count || 0;
  const failedRequests = metrics.http_req_failed?.values?.passes || 0;
  const successRate = totalRequests > 0 ? ((totalRequests - failedRequests) / totalRequests * 100) : 100;
  const iterations = metrics.iterations?.values?.count || 0;
  const avgDuration = metrics.http_req_duration?.values?.avg || 0;

  return `
    <div class="section">
      <h2>Summary</h2>
      <div class="summary-stats">
        <div class="stat-card blue">
          <div class="stat-value">${totalRequests}</div>
          <div class="stat-label">Total Requests</div>
        </div>
        <div class="stat-card green">
          <div class="stat-value">${formatNumber(successRate, 1)}%</div>
          <div class="stat-label">Success Rate</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${iterations}</div>
          <div class="stat-label">Iterations</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${formatNumber(avgDuration, 0)}ms</div>
          <div class="stat-label">Avg Response Time</div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generate metrics section
 */
function generateMetricsSection(metrics) {
  const httpMetrics = [
    { key: 'http_req_duration', name: 'Request Duration', unit: 'ms' },
    { key: 'http_req_waiting', name: 'Request Waiting Time', unit: 'ms' },
    { key: 'http_req_connecting', name: 'Connection Time', unit: 'ms' },
    { key: 'http_req_blocked', name: 'Request Blocked', unit: 'ms' },
  ];

  let metricsHtml = '<div class="metrics-grid">';
  
  httpMetrics.forEach(metric => {
    const data = metrics[metric.key];
    if (data && data.values) {
      const v = data.values;
      metricsHtml += `
        <div class="metric-card">
          <div class="metric-name">${metric.name}</div>
          <div class="metric-value">${formatNumber(v.avg, 2)}${metric.unit}</div>
          <div class="metric-details">
            <div class="metric-detail"><span>Min:</span><span>${formatNumber(v.min, 2)}${metric.unit}</span></div>
            <div class="metric-detail"><span>Max:</span><span>${formatNumber(v.max, 2)}${metric.unit}</span></div>
            <div class="metric-detail"><span>p(90):</span><span>${formatNumber(v['p(90)'], 2)}${metric.unit}</span></div>
            <div class="metric-detail"><span>p(95):</span><span>${formatNumber(v['p(95)'], 2)}${metric.unit}</span></div>
          </div>
        </div>
      `;
    }
  });
  
  metricsHtml += '</div>';

  return `
    <div class="section">
      <h2>HTTP Metrics</h2>
      ${metricsHtml}
    </div>
  `;
}

/**
 * Generate thresholds section
 */
function generateThresholdsSection(data) {
  const thresholds = data.metrics;
  let thresholdsHtml = '<div class="table-container"><table><thead><tr><th>Metric</th><th>Threshold</th><th>Status</th></tr></thead><tbody>';
  
  let hasThresholds = false;
  Object.keys(thresholds).forEach(key => {
    const metric = thresholds[key];
    if (metric.thresholds) {
      hasThresholds = true;
      Object.keys(metric.thresholds).forEach(threshold => {
        const passed = metric.thresholds[threshold].ok;
        thresholdsHtml += `
          <tr>
            <td>${key}</td>
            <td>${threshold}</td>
            <td><span class="status-badge ${passed ? 'status-pass' : 'status-fail'}">${passed ? 'PASS' : 'FAIL'}</span></td>
          </tr>
        `;
      });
    }
  });
  
  thresholdsHtml += '</tbody></table></div>';

  if (!hasThresholds) {
    thresholdsHtml = '<p style="color: #6c757d; font-style: italic;">No thresholds defined for this test.</p>';
  }

  return `
    <div class="section">
      <h2>Thresholds</h2>
      ${thresholdsHtml}
    </div>
  `;
}
