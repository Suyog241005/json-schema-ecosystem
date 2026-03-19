# Metric Analysis

## What do these metrics tell us about the JSON Schema ecosystem?

### npm Weekly Downloads

| Package                | Weekly Downloads |
| ---------------------- | ---------------- |
| ajv                    | ~258M            |
| jsonschema             | ~5.6M            |
| @hyperjump/json-schema | ~308K            |

**ajv's ~258 million weekly downloads** is one of the strongest signals we have about JSON Schema's real-world adoption. This isn't just direct usage — ajv is a transitive dependency in thousands of popular packages, meaning JSON Schema validation is deeply embedded in the Node.js ecosystem whether developers realize it or not.

The gap between ajv and the other validators also tells us something: the ecosystem is dominated by a single implementation. This is useful to track over time — if ajv's share starts declining and others grow, it may indicate ecosystem diversification or dissatisfaction.

**jsonschema (~5.6M/week)** and **@hyperjump/json-schema (~308K/week)** represent more deliberate, direct usage. Hyperjump is particularly interesting as it targets newer JSON Schema drafts (2019-09, 2020-12), so its growth would indicate adoption of the latest specification versions.

### GitHub Repository Count

**2,300+ repositories** tagged with the `json-schema` topic gives us a measure of ecosystem breadth — how many projects consider JSON Schema a primary part of their identity. Tracking this over time can show whether the ecosystem is growing, stagnating, or shrinking.

---

## Bowtie Test Results

The Bowtie test results show compliance across 32 JSON Schema implementations. This provides a measure of ecosystem health — how consistently different implementations interpret the specification. 15 implementations achieve perfect scores (100% compliance), 14 are high performers (95–99%), and 3 need improvement (<95%). The dominance of Go and Rust implementations at the top suggests these communities have invested heavily in spec-correctness. Tracking this over time can reveal whether implementations are improving, stagnating, or being abandoned.

## JSON Schema Draft Adoption

JSON Schema draft adoption — tracking GitHub references to each draft version (draft-05 through 2020-12) shows that 2020-12 leads at 49.5% (7,080 refs), with draft-07 still widely used at 24.5% (3,504 refs). This signals healthy but gradual migration to newer drafts.

---

## How would you automate this to run weekly?

This is already implemented and running via GitHub Actions. The workflow file is at
`.github/workflows/metrics.yml` and triggers every Monday at midnight UTC.
You can also trigger a manual run from the [Actions tab](https://github.com/Suyog241005/json-schema-ecosystem/actions/workflows/weekly.yml).

The workflow:

```yaml
name: Collect Ecosystem Metrics

on:
  schedule:
    - cron: "0 0 * * 1"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  collect-metrics:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Run metrics script
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npm run metrics

      - name: Run bowtie script
        run: npm run bowtie

      - name: Commit updated metrics & bowtie data
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add snapshots/ bowtie/
          git commit -m "chore: update ecosystem metrics & bowtie data $(date -u +%Y-%m-%d)" || echo "No changes"
          git push
```

This approach:

- Runs automatically every Monday
- Commits the updated `metrics-output.json` & `bowtie-scores.json` back to the repo
- Triggers a Vercel redeploy automatically, keeping the dashboard fresh
- Supports manual runs via `workflow_dispatch` for testing

Over time, the weekly commits create a historical record in git (via commit history and diffs) that can be used to analyze trends in downloads and repo counts.
The current implementation already writes dated snapshot files `(snapshots/metrics-YYYY-MM-DD.json)` each week, creating a queryable historical record.

---

## One challenge faced and the solution

**Challenge: Defining what counts as a "JSON Schema repository"**

While building the GitHub repo count metric, I ran into a fundamental question:
what actually qualifies as a JSON Schema repository? The `topic:json-schema`
search returned 2,300+ repositories — but many of the top results by stars were
large frameworks like FastAPI (~96K stars) and Pydantic (~27K stars) that use
JSON Schema internally, not as their primary focus.

This was raised and discussed in the JSON Schema Slack community — see the
[discussion here](https://json-schema.slack.com/archives/C5CF75URH/p1771883623351929?thread_ts=1771829405.608199&cid=C5CF75URH).

**Solution:**

After Ben Hutton (project mentor) clarified the project's intent in Slack, the approach settled on:

1. **Use `total_count` as a broad ecosystem signal** — the script intentionally
   reports the full count of topic-tagged repos. For observability purposes, knowing
   that FastAPI uses JSON Schema is an ecosystem signal worth tracking.
2. **Topic tags as the trust mechanism** — repos that self-tag with `json-schema`
   are self-identifying as ecosystem members, which is the intended discovery signal.
3. **Future direction** — Ben mentioned a "self-reporting manifest" approach where
   repos include a file the pipeline detects, enabling precise categorization into
   implementations vs. tooling vs. user projects.

The key insight is that for ecosystem observability, broad inclusion is valuable
as a starting point — the goal is an observable picture of the full ecosystem,
not just a curated list of implementations.

## AI Usage
I used AI assistance to improve the clarity and structure of the written 
explanations in this document. For the dashboard implementation, AI helped 
with some TypeScript type definitions, Chart.js integration details, and 
code suggestions. All metric choices, architectural decisions, API 
integrations, and GitHub Actions automation were designed and tested by 
me personally. I am confident in fully explaining all code and decisions.