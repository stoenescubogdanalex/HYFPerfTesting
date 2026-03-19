# HYFPerfTesting

Hack Your Future – k6 Performance Testing Framework

A lightweight, structured [k6](https://k6.io/) framework for running performance tests against a public REST API ([JSONPlaceholder](https://jsonplaceholder.typicode.com)).

---

## Project Structure

```
.
├── environments/          # Environment-specific configuration (base URL, etc.)
│   ├── dev.json
│   └── prod.json
├── lib/                   # Shared utilities
│   ├── checks.js          # Reusable k6 check helpers
│   ├── helpers.js         # Request helpers and random data generators
│   └── thresholds.js      # Shared performance thresholds per test type
└── tests/
    ├── smoke/
    │   └── smoke.test.js  # Smoke test  – 1 VU, 30 s
    ├── load/
    │   └── load.test.js   # Load test   – ramp to 10 VUs over 5 min
    └── stress/
        └── stress.test.js # Stress test – ramp to 100 VUs over ~16 min
```

---

## Prerequisites

Install k6 following the [official installation guide](https://k6.io/docs/getting-started/installation/).

| Platform | Command |
|----------|---------|
| macOS    | `brew install k6` |
| Linux (Debian/Ubuntu) | `sudo apt-get install k6` |
| Windows  | `choco install k6` or download the MSI from the [releases page](https://github.com/grafana/k6/releases) |

---

## Running Tests

All tests accept a `BASE_URL` environment variable so you can point them at any deployment. The default value is `https://jsonplaceholder.typicode.com`.

### Smoke Test

Quick sanity check – 1 virtual user for 30 seconds.

```bash
k6 run tests/smoke/smoke.test.js
```

### Load Test

Simulates normal expected traffic – ramps up to 10 VUs, holds for 3 minutes, then ramps down.

```bash
k6 run tests/load/load.test.js
```

### Stress Test

Pushes beyond normal capacity – ramps up to 100 VUs to find the breaking point.

```bash
k6 run tests/stress/stress.test.js
```

### Override the Base URL

```bash
k6 run --env BASE_URL=https://your-api.example.com tests/smoke/smoke.test.js
```

### Load an environment file

```bash
k6 run --env BASE_URL=$(node -e "console.log(require('./environments/dev.json').BASE_URL)") tests/load/load.test.js
```

---

## Thresholds

| Test Type | p(95) response time | p(99) response time | Error rate |
|-----------|--------------------|--------------------|------------|
| Smoke     | < 500 ms           | –                  | < 1 %      |
| Load      | < 1 000 ms         | < 2 000 ms         | < 5 %      |
| Stress    | < 3 000 ms         | –                  | < 10 %     |

---

## Saving Results

Export results to a JSON file for further analysis or CI artefact storage:

```bash
k6 run --out json=results/smoke.json tests/smoke/smoke.test.js
```

---

## API Under Test

All tests target [JSONPlaceholder](https://jsonplaceholder.typicode.com), a free public REST API that simulates a blog back-end with posts, users, and comments.

| Endpoint        | Method | Description          |
|----------------|--------|----------------------|
| `/posts`        | GET    | List all posts        |
| `/posts/:id`    | GET    | Get a single post     |
| `/posts`        | POST   | Create a post         |
| `/users/:id`    | GET    | Get a single user     |
| `/comments/:id` | GET    | Get a single comment  |

