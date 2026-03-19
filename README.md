# JSON Schema Ecosystem Observability

An automated dashboard and data pipeline providing continuous visibility into the health, adoption, and evolution of the global JSON Schema landscape.

> **GSoC 2026 Qualification Task**: Built for the [JSON Schema organization](https://json-schema.org/).

## 🚀 Quick Links

- **Live Dashboard**: [json-schema-ecosystem.vercel.app](https://json-schema-ecosystem.vercel.app/)
- **Part 1: Metric Analysis**: [`analysis.md`](./analysis.md)
- **Part 2: Code Evaluation**: [`evaluation.md`](./evaluation.md)

## ✨ Strategic Insights

- **Real-time Metrics**: Tracks npm weekly downloads for core libraries (`ajv`, `jsonschema`, etc.).
- **Repo Explorer**: Analyzes 2,300+ GitHub repositories tagged with `json-schema`.
- **Bowtie Insights**: Visualizes implementation compliance scores across the ecosystem.
- **Draft Adoption**: Monitors the distribution of JSON Schema versions (Draft 7 vs. 2020-12).
- **Automated Pipeline**: Weekly data snapshots via GitHub Actions.
- **Adoption Velocity (Evolution)**: Tracks spec implementation momentum
- **Maintenance Health**: Analyzes real-time GitHub activity and release frequency to identify project vitality.
- **Compliance Matrix**: Visualizes Bowtie test results for 30+ implementations to identify spec-conformance gaps.
- **Community Momentum**: Tracks contributor growth and maintainer responsiveness (Issue/PR turnaround).
- **Automated Pipeline**: Fully hands-off weekly snapshots orchestrated via GitHub Actions.

## 🏗️ Technical Architecture

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui.
- **Visualization**: Chart.js for interactive time-series and distribution charts.
- **Infrastructure**: **Git-native JSON Data Store**. Metrics are unified in a version-controlled `/data` hierarchy for transparency and zero-cost persistence.
  - **Snapshots**: Weekly JSON data stored in `/snapshots` for historical tracking.
  - **Insights**: Weekly JSON data stored in `/insights` for historical tracking.
  - **Bowtie**: Weekly JSON data stored in `/bowtie` for historical tracking.
  - **In-repo Storage**: `latest-metrics.json` serves as the primary data source for the UI.
  - **Automation**: GitHub Actions script (`.github/workflows/metrics.yml`) runs every Monday.
- **Resilience**: Node.js/TypeScript fetchers with **Octokit Throttling** for robust batch API operations.

## 📁 Project Structure

```
├── app/                    # Next.js Routes & API
│   ├── insights/           # Deep-dive metric hub (Languages, Velocity, etc.)
│   ├── bowtie/             # Compliance matrix view
│   ├── drafts/             # Draft adoption analysis
│   └── api/                # High-performance data endpoints
├── components/             # UI Layer
│   ├── insights/           # Feature-specific components (Sparklines, Charts)
│   ├── metrics/            # Core ecosystem overview components
│   └── ui/                 # Atomic shadcn/ui components
├── data/                   # Git-Native Data Store
│   ├── snapshots/          # Phase 1 historical metrics
│   ├── insights/           # Phase 2 strategic metrics
│   └── bowtie/             # Compliance and test result snapshots
├── hooks/                  # Custom React hooks (Data fetching, Mobile detection)
├── lib/                    # Core Business Logic
│   ├── fetchers/           # API integration (GitHub, Bowtie)
│   ├── processors/         # Data calculation & trend logic
│   └── types/              # Centralized TypeScript interfaces
└── scripts/                # Automation & Data Collection entry points
```

## 🔧 Local Setup

1. **Install**:

```bash
npm install
```

2. **Configure**: Add `GITHUB_TOKEN` to `.env` for full data collection.
3. **Dev**:

```bash
npm run dev
```

---

_Authored by Suyog Habbu. Logic, architecture, and visualizations are original implementations based on ecosystem research._
