# JSON Schema Ecosystem Observability

An automated dashboard and data pipeline providing continuous visibility into the health, adoption, and evolution of the global JSON Schema landscape.

> **GSoC 2026 Qualification Task**: Built for the [JSON Schema organization](https://json-schema.org/).

## 🚀 Quick Links
- **Live Dashboard**: [json-schema-ecosystem.vercel.app](https://json-schema-ecosystem.vercel.app/)
- **Part 1: Metric Analysis**: [`analysis.md`](./analysis.md)
- **Part 2: Code Evaluation**: [`evaluation.md`](./evaluation.md)

## ✨ Strategic Capabilities
- **Evolutionary Metrics (Velocity)**: Tracks the speed of spec adoption and implementation improvements over an 8-week rolling window.
- **Maintenance Health**: Identifies stale vs. active projects using real-time GitHub activity signals.
- **Compliance Tracking**: Visualizes Bowtie test results for 30+ implementations across multiple drafts.
- **Community Momentum**: Measures contributor growth and maintainer responsiveness (PR/Issue turnaround).
- **Automated Pipeline**: Fully hands-off weekly snapshots via GitHub Actions.

## 📊 Technical Stack
- **Frontend**: Next.js 15 (App Router), React 19, Chart.js, Tailwind CSS, Framer Motion.
- **Backend**: Node.js/TypeScript fetchers with Octokit Throttling for resilient API integration.
- **Data**: Git-native JSON storage in `/data` directory (No external DB required).

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
├── data/                   # Unified metrics data
│   ├── snapshots/          # Historical Phase 1 metrics
│   ├── bowtie/             # Bowtie test results and scores
│   └── insights/           # Detailed Phase 2 insights
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
│   ├── bowtie-score.ts   # Bowtie processing
│   ├── insights.ts       # Insights collection

```

## 🔧 Local Setup
1. **Install**: `npm install`
2. **Configure**: Add `GITHUB_TOKEN` to `.env` for full data collection.
3. **Collect**: `npm run metrics:insights` (Generates latest observability signals).
4. **Dev**: `npm run dev`

---
*Authored by Suyog Habbu. Logic, architecture, and visualizations are original implementations based on ecosystem research.*
