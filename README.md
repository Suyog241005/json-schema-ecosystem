# JSON Schema Ecosystem

A small Next.js dashboard that showcases the top GitHub repositories in the **JSON Schema ecosystem**, fetched using the GitHub Search API with:

`topic:json-schema`

The UI is built with **Tailwind CSS** and **shadcn/ui** components, and includes a dark/light/system theme toggle.

## Features

- **Top repositories** for the `json-schema` topic (sorted by stars)
- **Repo cards** with:
  - description
  - language
  - stars / forks / open issues
  - topics
  - last updated date
  - link to GitHub
- **Theme toggle** (light / dark / system)

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Octokit (GitHub API)

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.