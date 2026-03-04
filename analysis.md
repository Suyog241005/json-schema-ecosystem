# Metric Analysis

## What do these metrics tell us about the JSON Schema ecosystem?

### npm Weekly Downloads

| Package                | Weekly Downloads |
| ---------------------- | ---------------- |
| ajv                    | ~243M            |
| jsonschema             | ~5.3M            |
| @hyperjump/json-schema | ~308K            |

**ajv's ~243 million weekly downloads** is one of the strongest signals we have about JSON Schema's real-world adoption. This isn't just direct usage — ajv is a transitive dependency in thousands of popular packages, meaning JSON Schema validation is deeply embedded in the Node.js ecosystem whether developers realize it or not.

The gap between ajv and the other validators also tells us something: the ecosystem is dominated by a single implementation. This is useful to track over time — if ajv's share starts declining and others grow, it may indicate ecosystem diversification or dissatisfaction.

**jsonschema (~5.3M/week)** and **@hyperjump/json-schema (~308K/week)** represent more deliberate, direct usage. Hyperjump is particularly interesting as it targets newer JSON Schema drafts (2019-09, 2020-12), so its growth would indicate adoption of the latest specification versions.

### GitHub Repository Count

**2,377 repositories** tagged with the `json-schema` topic gives us a measure of ecosystem breadth — how many projects consider JSON Schema a primary part of their identity. Tracking this over time can show whether the ecosystem is growing, stagnating, or shrinking.

---

## How would you automate this to run weekly?

Using a GitHub Actions scheduled workflow:

```yaml
name: Collect Ecosystem Metrics

on:
  schedule:
    - cron: "0 0 * * 1" # Every Monday at midnight UTC
  workflow_dispatch: # Allow manual runs

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
        run: npm install

      - name: Run metrics script
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npm run metrics

      - name: Commit updated metrics
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add metrics-output.json
          git commit -m "chore: update ecosystem metrics $(date -u +%Y-%m-%d)" || echo "No changes"
          git push
```

This approach:

- Runs automatically every Monday
- Commits the updated `metrics-output.json` back to the repo
- Triggers a Vercel redeploy automatically, keeping the dashboard fresh
- Supports manual runs via `workflow_dispatch` for testing

Over time, storing weekly snapshots builds a historical dataset that can power trend charts — showing how downloads and repo counts have changed month over month.

---

## One challenge faced and the solution

**Challenge: Defining what counts as a "JSON Schema repository"**

While building the GitHub repo count metric, I ran into a fundamental question:
what actually qualifies as a JSON Schema repository? The `topic:json-schema`
search returned 2,377 repositories — but many of the top results by stars were
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
