# JSON Schema Ecosystem Analysis

Analysis of the observability signals collected from the global JSON Schema landscape.

---

## 📈 Key Observability Signals

### 1. npm Download Footprint
Ajv’s **~218 million weekly downloads** demonstrate that JSON Schema is a critical, load-bearing specification for the modern internet (transitive in OpenAPI, Webpack, AWS SDKs, etc.).

### 2. Adoption Velocity (Evolution)
**Velocity** measures the speed at which implementations add support for new spec drafts (like 2020-12).
- **Fast Adopters (>2% improvement/week)**: Signaling aggressive spec alignment.
- **Legacy Stability**: Identification of projects that have plateaued on Draft-07, indicating where migration support is needed.

### 3. Maintenance & Community Health
- **Ecosystem Health**: 2,400+ self-identified GitHub repos analyze maintenance status.
- **Responsiveness**: Real-time tracking of maintainer turnaround for PRs/Issues across 30+ implementations.
- **Momentum**: Unique monthly contributor growth indicates project vitality.

### 4. Language Diversity
Mapping implementations across 15+ languages (Java, TypeScript, Rust, etc.) identifies gaps in spec-compliant tooling for specific developer communities.

---

## ⚙️ Automation & Persistence

The pipeline is fully automated via **GitHub Actions** (`weekly.yml`).
- **Storage**: Weekly snapshots are stored as JSON in `data/insights/`, creating a Git-native historical record.
- **Integrity**: Octokit Throttling ensures reliable collection across 30+ repositories without hitting API rate limits.

---

## 🧩 Challenges & Solutions

**Challenge**: Defining "Ecosystem Membership"  
Initially, it was unclear whether large projects using JSON Schema internally (like FastAPI) should be included in the "Ecosystem Repo" count.

**Solution**:  
After community consultation (JSON Schema Slack), we settled on **self-identification via topics**. If a project owner tags their repo with `json-schema`, they are signaling membership in the ecosystem. This provides the most honest "observability" of the landscape without external gatekeeping.

---

## 🤖 AI Usage
I utilized AI as a collaborative "pair programmer" for:
- Refatcoring the UI into a scalable component-based architecture.
- Optimizing data processing logic for the "8-week rolling window" metric.
- Improving the stylistic clarity of technical documentation.

All architectural decisions and logic flows were verified by the developer to ensure accuracy.
