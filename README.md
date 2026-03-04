# JSON Schema Ecosystem Observability Dashboard

A comprehensive Next.js dashboard for **JSON Schema ecosystem observability** that demonstrates real-time metrics collection, visualization, and repository analysis.

## 🎯 Qualification Task Overview

This project implements a Proof of Concept (PoC) for JSON Schema ecosystem observability:

### Core Metrics Collection & Visualization ✅

- **npm weekly downloads** for the `ajv` package
- **GitHub repository count** for repositories with `json-schema` topic
- **Structured JSON output** with timestamped metrics
- **Interactive Chart.js visualization** with professional UI
- **Metrics collection script** that saves data to `metrics-output.json`
- **GitHub repository explorer** shows top 100 repositories sorted by stars
- **Next.js integration** with API routes and client-side rendering

## 🚀 Features

### Metrics Dashboard (`/metrics`)

- **Real-time data fetching** from npm and GitHub APIs
- **Interactive bar charts** with Chart.js
- **Professional card layouts** with linear designs
- **Animated UI elements** and smooth transitions
- **Error handling** and loading states

### Repository Explorer (`/`)

- **Top repositories** sorted by stars
- **Rich repository cards** displaying:
  - Repository name and description
  - Programming language
  - Stars, forks, and open issues count
  - Topics and tags
  - Last updated timestamp
  - Active status indicators
- **GitHub integration** with direct repository links

### Navigation & UX

- **Modern navigation** with active state indicators
- **Theme toggle** supporting light/dark/system preferences
- **Responsive design** optimized for mobile and desktop
- **Professional animations** and micro-interactions

## 🛠 Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Data Visualization**: Chart.js
- **API Integration**:
  - GitHub API (via Octokit)
  - npm Downloads API

## 📊 Metrics Collection

### Data Sources

1. **npm API**: Weekly downloads for `ajv` package
   - Endpoint: `https://api.npmjs.org/downloads/point/last-week/ajv`
   - Data: Download count, date range, package info

2. **GitHub API**: Repository search for `json-schema` topic
   - Endpoint: `https://api.github.com/search/repositories?q=topic:json-schema`
   - Data: Repository count, metadata, statistics

### Output Format

```json
{
  "timestamp": "2026-03-04T12:00:00.000Z",
  "npm": {
    "package": "ajv",
    "weeklyDownloads": 1597,
    "dateRange": {
      "start": "2026-02-24",
      "end": "2026-03-02"
    }
  },
  "github": {
    "topic": "json-schema",
    "repoCount": 2847
  }
}
```

## 🌐 Live Demo

**Live URL**: [JSON Schema Ecosystem Dashboard](https://json-schema-ecosystem.vercel.app)

Experience the live demonstration of:

- Real-time metrics visualization with Chart.js
- Interactive repository exploration
- Professional UI with theme support
- Responsive design for all devices

## 🔧 Setup

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   ```

2. Run the following commands

   ```bash
   npm install

   npm run dev
   ```

3. Open your browser and navigate to
   http://localhost:3000

   The metrics are collected and saved to `metrics-output.json` file.
   (to run only the metrics collection, use `npm run metrics`)
