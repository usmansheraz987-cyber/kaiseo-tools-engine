# SEO Analyzer – v1

Single-page SEO analysis engine focused on clarity, accuracy, and prioritization.

## Philosophy

This analyzer uses a **hybrid model**:
- Google-required rules first (indexability)
- Practical SEO rules second (performance)
- Optional hygiene checks last

Nothing is mixed. Everything is labeled.

## What this tool does

- Analyzes one page at a time
- Requires raw HTML (URL fetching optional later)
- Returns:
  - clear checks
  - transparent scoring
  - human-readable fixes

## What this tool does NOT do

- Crawl multiple pages
- Analyze backlinks
- Measure Core Web Vitals
- Render JavaScript
- Validate schema markup

Those are deliberate exclusions.

## Categories

### Indexability (critical)
Blocking issues that prevent ranking or crawling.

### Content (performance)
Issues that affect ranking strength or CTR.

### Technical (hygiene)
Best practices that improve usability and crawl flow.

## Scoring

Weights:
- Indexability: 40%
- Content: 35%
- Technical: 25%

Rules:
- Any critical indexability failure caps the score
- Warnings reduce score softly
- Optional issues never destroy scores

Scores are explainable and deterministic.

## Versions

- v1: rule-based hybrid analyzer
- v2 (planned): intent-aware analysis, competitor baselines
- v3 (planned): AI-assisted fixes (paid)

## Contract

Analyzer output must always follow `schema.js`.
Breaking this requires a new version.

## Ownership

This tool is designed to be:
- fast
- honest
- stable
- upgrade-safe

No fake urgency. No SEO myths.
