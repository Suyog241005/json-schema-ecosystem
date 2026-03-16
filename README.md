# JSON Schema Ecosystem Observability

An automated dashboard providing visibility into the JSON Schema ecosystem through real-time metrics, historical trends, and implementation compliance analysis.

> **Note**: This project is a qualification task for the [Google Summer of Code 2026](https://json-schema.org/blog/posts/gsoc-2026-call-for-proposals) project: *JSON Schema Ecosystem Observability*.

## 🚀 Quick Links

- **Live Dashboard**: [json-schema-ecosystem.vercel.app](https://json-schema-ecosystem.vercel.app/)
- **Part 1: Metric Analysis**: [`analysis.md`](./analysis.md)
- **Part 2: Code Evaluation**: [`evaluation.md`](./evaluation.md)

## ✨ Key Features

- **Real-time Metrics**: Tracks npm weekly downloads for core libraries (`ajv`, `jsonschema`, etc.).
- **Repo Explorer**: Analyzes 2,300+ GitHub repositories tagged with `json-schema`.
- **Bowtie Insights**: Visualizes implementation compliance scores across the ecosystem.
- **Draft Adoption**: Monitors the distribution of JSON Schema versions (Draft 7 vs. 2020-12).
- **Automated Pipeline**: Weekly data snapshots via GitHub Actions.

## 📊 Technical Architecture

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui.
- **Visualization**: Chart.js for interactive time-series and distribution charts.
- **Backend/Data**:
  - **Snapshots**: Weekly JSON data stored in `/snapshots` for historical tracking.
  - **In-repo Storage**: `latest-metrics.json` serves as the primary data source for the UI.
  - **Automation**: GitHub Actions script (`.github/workflows/metrics.yml`) runs every Monday.

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

## 🔧 Local Setup

### Prerequisites
- Node.js 18+
- GitHub Token (Optional, for higher rate limits)

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/Suyog241005/json-schema-ecosystem.git
   cd json-schema-ecosystem
   npm install
   ```

2. **Run Scripts**
   ```bash
   npm run metrics  # Fetch latest ecosystem data
   npm run bowtie   # Process compliance scores
   ```

3. **Development Server**
   ```bash
   npm run dev      # Start at http://localhost:3000
   ```

---

*Briefly assisted by AI for document structuring and clarity. All core decisions and implementations are original.*

