# JSON Schema Ecosystem Observability Dashboard

A comprehensive Next.js dashboard for **JSON Schema ecosystem observability** that demonstrates real-time metrics collection, visualization, and repository analysis.

## 🎯 Qualification Task Overview

This project implements a Proof of Concept (PoC) for JSON Schema ecosystem observability:

### Core Metrics Collection & Visualization ✅

- **npm weekly downloads** for key JSON Schema libraries (ajv, jsonschema, @hyperjump/json-schema)
- **GitHub repository explorer** showing top repositories sorted by stars with pagination
- **Structured JSON output** with timestamped metrics and historical snapshots
- **Interactive Chart.js visualizations** with professional UI
- **Bowtie test results** showing JSON Schema implementation compliance scores
- **JSON Schema draft adoption** tracking across different versions
- **Metrics collection scripts** with automated data gathering
- **Next.js integration** with API routes and client-side rendering

## 📄 Qualification Analysis

See [`analysis.md`](./analysis.md) for:

- What these metrics tell us about the JSON Schema ecosystem?
- How to automate the script weekly?
- One challenge faced and the solution?

## 📄 Part 2 — Evaluation

See [`evaluation.md`](./evaluation.md) for:

- Review of the existing PoC / approach
- Assessment of what works well vs gaps
- Recommendations and next steps

## 🚀 Features

### Metrics Dashboard ([`/`](https://json-schema-ecosystem.vercel.app/))

- **Real-time data fetching** from npm API
- **Interactive bar charts** with Chart.js for weekly downloads
- **Trend analysis** with logarithmic scale line charts
- **Professional card layouts** with linear designs
- **Error handling** and loading states

### Repository Explorer ([`/repo`](https://json-schema-ecosystem.vercel.app/repo))

- **Top repositories** sorted by stars
- **Rich repository cards** displaying:
  - Repository name and description
  - Programming language
  - Stars, forks, and open issues count
  - Topics and tags
  - Last updated timestamp
  - Active status indicators
- **GitHub integration** with direct repository links
- **Pagination system** respecting GitHub API limits

### Bowtie Test Results ([`/bowtie`](https://json-schema-ecosystem.vercel.app/bowtie))

- **Implementation compliance scores** for 32 JSON Schema implementations
- **Horizontal bar chart** with performance-based color coding
- **Detailed statistics** showing pass/fail ratios
- **Interactive tooltips** with test details
- **Performance categorization** (Perfect, High Performer, Needs Improvement)

### Draft Adoption Analysis ([`/drafts`](https://json-schema-ecosystem.vercel.app/drafts))

- **JSON Schema draft version distribution** across GitHub repositories
- **Pie chart visualization** with adoption percentages
- **External links** to official JSON Schema specifications
- **Real-time search results** via GitHub API

### Navigation & UX

- **Modern navigation** with active state indicators
- **Theme toggle** supporting light/dark/system preferences
- **Professional styling** with minimal, clean interface

## 🛠 Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Data Visualization**: Chart.js
- **API Integration**:
  - GitHub API (via Octokit)
  - npm Downloads API

## 📊 Data Collection & Storage

### Data Sources

1. **npm API**: Weekly downloads for key JSON Schema libraries
   - ajv
     - Endpoint: `https://api.npmjs.org/downloads/point/last-week/ajv`
   - jsonschema
     - Endpoint: `https://api.npmjs.org/downloads/point/last-week/jsonschema`
   - @hyperjump/json-schema
     - Endpoint: `https://api.npmjs.org/downloads/point/last-week/@hyperjump/json-schema`

2. **GitHub API**: Repository search for `json-schema` topic
   - Endpoint: `https://api.github.com/search/repositories?q=topic:json-schema`
   - Data: Repository count, metadata, statistics

3. **Bowtie Test Suite**: Implementation compliance testing
   - 32+ implementations across multiple languages
   - 2020-12 dialect compliance testing
   - Performance scoring and ranking

4. **Draft Adoption Analysis**: JSON Schema draft version distribution
   - Search the references of the draft versions in repositories
   - Count the occurrences of each draft version

### Storage System

- **Latest snapshot**: `snapshots/latest-metrics.json` - Always contains most recent metrics
- **Historical snapshots**: `snapshots/metrics-output-YYYY-MM-DD.json` - Weekly snapshots for trend analysis
- **Bowtie scores**: `bowtie/bowtie-scores.json` - Implementation compliance results
- **Draft adoption**: collects data dynamically from GitHub API

#### How It Works

1. **Weekly Snapshots and Bowtie Runs**: Each run creates a dated file `metrics-output-YYYY-MM-DD.json` and updates `bowtie/bowtie-scores.json`
2. **Latest Alias**: `latest-metrics.json` always points to the most recent snapshot
3. **Historical Tracking**: All snapshots are preserved for trend analysis
4. **API Integration**: The dashboard reads from `latest-metrics.json`
5. **Repositories**: The repositories' dashboard collects data from GitHub API dynamically
6. **Bowtie Scores**: The bowtie dashboard reads from `bowtie/bowtie-scores.json`
7. **Draft Adoption**: The drafts' dashboard collects data from GitHub API dynamically

#### Benefits

- ✅ **Historical Analysis**: Track ecosystem changes over time
- ✅ **Data Integrity**: No data loss during updates
- ✅ **Easy Rollback**: Access any previous snapshot
- ✅ **Trend Tracking**: Compare metrics across different dates

#### Automation

The GitHub Actions workflow automatically:

- Creates new snapshots weekly
- Updates `latest-metrics.json`
- Runs bowtie score calculations
- Commits all data files to the repository
- Triggers Vercel redeploy automatically
- Supports manual runs via `workflow_dispatch`

### Output Format

#### Metrics Output
```json
{
  "timestamp": "2026-03-04T11:34:10.415Z",
  "ajv": {
    "package": "ajv",
    "weeklyDownloads": 243663432
  },
  "hyperjump": {
    "package": "@hyperjump/json-schema",
    "weeklyDownloads": 308602
  },
  "jsonschema": {
    "package": "jsonschema",
    "weeklyDownloads": 5329823
  },
  "githubRepoCount": 2377
}
```

#### Bowtie Scores Output
```json
{
  "timestamp": "2026-03-04T11:34:10.415Z",
  "implementations": [
    {
      "name": "ajv",
      "version": "8.17.1",
      "pass": 1234,
      "fail": 56,
      "score": 95.5
    }
  ]
}
```

### Snapshot System

The metrics collection uses a **snapshot-based storage system**:

- **Latest snapshot**: `snapshots/latest-metrics.json` - Always contains the most recent metrics
- **Historical snapshots**: `snapshots/metrics-output-YYYY-MM-DD.json` - Weekly snapshots for historical tracking

## 📁 Project Structure
```
json-schema-ecosystem/
├── app/                    # Next.js app routes
│   ├── api/             # API endpoints
│   ├── bowtie/          # Bowtie test results page
│   ├── drafts/          # Draft adoption page
│   ├── repo/            # Repository explorer page
│   └── globals.css      # Global styles
│   └── page.tsx         # Metrics page
├── components/             # React components
│   ├── ui/              # shadcn/ui components
│   ├── navigation.tsx    # Main navigation
│   ├── metrics/          # Metrics components
│   ├── repo/             # Repository components
│   ├── bowtie/          # Bowtie components
│   └── drafts/          # Draft components
├── lib/                   # Utilities
│   ├── octokit.ts        # GitHub API functions
│   ├── constants.ts      # Draft definitions
│   └── utils.ts          # Helper functions
├── scripts/                # Data collection scripts
│   ├── metrics.ts        # Metrics collection
│   └── bowtie-score.ts   # Bowtie processing
├── bowtie/                 # Bowtie data files
│   ├── bowtie-scores.json    # Processed scores
│   └── bowtie-implementations.json # Raw data
└── snapshots/              # Historical metrics
    ├── latest-metrics.json   # Current metrics
    └── metrics-output-*.json # Historical snapshots
```

## 🌐 Live Demo

**Live URL**: [JSON Schema Ecosystem Dashboard](https://json-schema-ecosystem.vercel.app)

Experience the live demonstration of:

- Real-time metrics visualization with Chart.js
- Interactive repository exploration
- Professional UI with theme support

## 🔧 Setup

### Prerequisites

- Node.js 18+
- npm
- GitHub API token (optional but recommended for higher rate limits)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/Suyog241005/json-schema-ecosystem.git
   ```

2. Run the following commands

   ```bash
   npm install
   ```

   Install dependencies

   ```bash
   npm run metrics
   ```

   Collect metrics

   The metrics are collected and saved to `snapshots/latest-metrics.json` file.

   ```bash
   npm run bowtie
   ```

   Run bowtie score calculations

   ```bash
   npm run dev
   ```

   Runs the development server

3. Open your browser and navigate to
   http://localhost:3000
