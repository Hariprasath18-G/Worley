# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Transition Pathfinder is an AI-powered web tool for Worley consulting leads. Users input industrial asset data (manually or via document upload), and the tool generates multi-pathway scenario comparisons across four transition options: Optimize+CCS, Repurpose to Green Hydrogen, Repurpose to Biofuels, and Full Decommission. This is a demo/immersion-day tool, not a production engineering system.

## Commands

```bash
npm run dev          # Start dev server (Next.js with Turbopack)
npm run build        # Production build
npm run lint         # ESLint (flat config, Next.js core-web-vitals + TypeScript)
npm test             # Run all Jest tests
npm test -- --watch  # Watch mode
npm test -- __tests__/lib/sensitivityScoring.test.ts   # Run single test file
npm run test:coverage  # Jest with coverage report
```

## Architecture

### Three-Screen Flow (Stateless)
- **Screen 1** (`app/page.tsx`) — Asset intake: manual form + document upload + "Try sample asset" button
- **Screen 2** (`app/analyze/page.tsx`) — Processing/loading: animated progress steps while API call runs; falls back to demo data on failure
- **Screen 3** (`app/results/page.tsx`) — Results: pathway cards, charts, ESG summary, comparison matrix, recommendation, next steps, precedent studies, sensitivity analysis, export actions

No database. State flows through React Context (`AppProvider` in `components/AppProvider.tsx`) with sessionStorage backup for page-refresh resilience. Hydration guard (`isHydrated`) prevents flash of empty content on navigation.

### API Route (`app/api/analyze/route.ts`)
Single POST endpoint handling two `analysisType` values:
- `extractProfile` — sends uploaded document text to OpenAI for structured asset data extraction
- `generateScenarios` — sends asset profile to OpenAI for full four-pathway analysis

Uses **OpenAI API** (not Gemini despite what the PRD says). Env vars: `OPENAI_API_KEY`, `OPENAI_MODEL` (defaults to `gpt-4o-mini`). Model must be in the `ALLOWED_MODELS` allowlist. Includes rate limiting (10 req/min per IP), input sanitization, origin validation, body/field size limits, and response schema validation.

### Key Lib Modules
- `lib/types.ts` — All TypeScript interfaces/types, constants, enum arrays, pathway color map, sensitivity slider configs, score weights
- `lib/prompts.ts` — System prompts for both AI call types (asset extraction + pathway generation)
- `lib/responseParser.ts` — Defensive JSON parser handling markdown fences and brace-counting extraction
- `lib/sensitivityScoring.ts` — Pure function scoring engine for what-if analysis (carbon price, CAPEX budget, emissions target, asset life, discount rate)
- `lib/sampleData.ts` — Pre-built sample asset ("Coastal Energy Refinery")
- `lib/sampleAnalysisResult.ts` — Pre-built full analysis result for demo/fallback
- `lib/reportExporter.ts` — JSON export and printable-PDF-via-new-tab export
- `lib/context.ts` — React Context definition and `useAppContext` hook
- `lib/documentExtractor.ts` — Client-side document text extraction (PDF via pdfjs-dist, DOCX via mammoth, XLSX via xlsx)

### Component Conventions
All components are in `components/`. They are client components (`'use client'`). Major ones:
- `AssetForm` — form with dropdowns/inputs matching `AssetProfile` fields
- `DocumentUpload` — drag-and-drop with client-side text extraction
- `ResultsTabs` — tab switcher between main results view and sensitivity analysis
- `SensitivityTab` / `AssumptionSliders` / `SensitivityCharts` — interactive what-if analysis
- `PathwayCard`, `ComparisonMatrix`, `PathwayCharts`, `ESGSummary`, `DecisionFlowDiagram` — results display

### Styling
Tailwind CSS v4 with CSS-first `@theme` configuration in `app/globals.css`. The design uses a **Worley teal brand palette** (not orange despite PRD — the `--color-worley-orange` alias maps to teal `#025966`). Light theme with white background. Custom animations for loading dots and step pulse. `tailwind.config.ts` exists for content paths but `@theme` in globals.css is the primary config.

### Testing
Jest + jsdom + React Testing Library. Tests in `__tests__/` mirror source structure (`__tests__/lib/`, `__tests__/components/`, `__tests__/api/`, `__tests__/integration/`). Global mocks in `jest.setup.ts` for `next/navigation`, `sessionStorage`, and `ResizeObserver`. Path alias `@/*` mapped in `jest.config.js`. CSS modules proxied via `identity-obj-proxy`.

## Important Notes

- **Next.js 16**: This project uses Next.js 16.2.1 with React 19. Check `node_modules/next/dist/docs/` for API changes before assuming Next.js patterns from training data.
- **Document extraction is client-side**: PDF.js, mammoth, and xlsx all run in the browser. The API route only receives extracted text.
- `next.config.ts` aliases `canvas` to empty/false for pdfjs-dist compatibility in both Turbopack and Webpack.
- The `SAMPLE_ANALYSIS_RESULT` in `lib/sampleAnalysisResult.ts` is a large (~26KB) hardcoded fixture used both as demo fallback and in tests.
- The four pathway names (`"Optimize + CCS"`, `"Repurpose to Green Hydrogen"`, `"Repurpose to Biofuels"`, `"Full Decommission"`) are used as keys in `PATHWAY_COLOR_MAP` — changing them requires updating the map.
